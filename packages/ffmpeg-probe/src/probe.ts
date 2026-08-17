import { VerticalAdapter, type AdapterCapability, type VerticalInspectionResult } from '@berryn/adapter-framework';
import type { Diagnostic, RunContext } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { inspectProject } from '@berryn/project-inspect';

export interface FfmpegInspectionResult extends VerticalInspectionResult {
  fluentFfmpegDetected: boolean;
  directSpawnObserved: boolean;
  recommendedPath: 'direct-spawn' | 'facade' | 'manual-refactor';
}

export class FfmpegProbeAdapter extends VerticalAdapter<FfmpegInspectionResult> {
  readonly verticalId = 'ffmpeg';
  readonly capabilities: AdapterCapability[] = [
    {
      id: 'cap_ffmpeg_inspect',
      name: 'FFmpeg Workflow Probe',
      vertical: 'ffmpeg',
      supportedOperations: ['detect-fluent-ffmpeg', 'evaluate-direct-spawn']
    }
  ];

  async inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: FfmpegInspectionResult; diagnostics: Diagnostic[] }> {
    const diagnostics: Diagnostic[] = [];

    const { value: projectResult } = inspectProject(targetPath);
    const fluentDetected =
      !!projectResult.manifest.dependencies?.['fluent-ffmpeg'] ||
      !!projectResult.manifest.devDependencies?.['fluent-ffmpeg'];

    if (fluentDetected) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.PROJ_INCUMBENT_DETECTED,
          severity: 'info',
          message: "Detected deprecated 'fluent-ffmpeg' dependency.",
          remediation: 'Consider migrating to direct child_process.spawn("ffmpeg", [...args]) for direct control.'
        })
      );
    }

    const recommendedPath = fluentDetected ? 'direct-spawn' : 'manual-refactor';

    return {
      value: {
        vertical: 'ffmpeg',
        incumbentName: 'fluent-ffmpeg',
        fluentFfmpegDetected: fluentDetected,
        directSpawnObserved: false,
        recommendedPath,
        observedPatterns: fluentDetected ? ['fluent-ffmpeg import', 'ffmpeg command chain'] : []
      },
      diagnostics
    };
  }

  async evaluateMigrationFeasibility(
    targetPath: string
  ): Promise<{ feasible: boolean; recommendedApproach: 'direct-spawn' | 'facade' | 'manual-refactor' | 'blocked' }> {
    return {
      feasible: true,
      recommendedApproach: 'direct-spawn'
    };
  }
}
