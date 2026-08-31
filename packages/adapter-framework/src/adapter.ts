import type { Diagnostic, ResultEnvelope, RunContext } from '@berryn/core';

export interface AdapterCapability {
  id: string;
  name: string;
  vertical: 'xlsx' | 'ffmpeg' | 'generic';
  supportedOperations: string[];
}

export interface VerticalInspectionResult {
  vertical: string;
  incumbentName: string;
  detectedVersion?: string | undefined;
  observedPatterns: string[];
}

export abstract class VerticalAdapter<TResult = VerticalInspectionResult> {
  abstract readonly verticalId: string;
  abstract readonly capabilities: AdapterCapability[];

  abstract inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: TResult; diagnostics: Diagnostic[] }>;

  abstract evaluateMigrationFeasibility(
    targetPath: string
  ): Promise<{ feasible: boolean; recommendedApproach: 'direct-spawn' | 'facade' | 'manual-refactor' | 'blocked' }>;
}
