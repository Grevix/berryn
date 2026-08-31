import type { Diagnostic, RunContext } from '@berryn/core';
import { inspectProject } from '@berryn/project-inspect';
import { VerticalAdapter, type AdapterCapability, type VerticalInspectionResult } from '../adapter.js';

export class XlsxVerticalAdapter extends VerticalAdapter<VerticalInspectionResult> {
  readonly verticalId = 'xlsx';
  readonly capabilities: AdapterCapability[] = [
    {
      id: 'xlsx-opc-inspect',
      name: 'Open Packaging Conventions Inspection',
      vertical: 'xlsx',
      supportedOperations: ['zip-container', 'rels-graph', 'content-types']
    },
    {
      id: 'xlsx-exceljs-codemod',
      name: 'ExcelJS AST Codemod Engine',
      vertical: 'xlsx',
      supportedOperations: ['import-rewrite', 'require-rewrite', 'reversal']
    }
  ];

  async inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: VerticalInspectionResult; diagnostics: Diagnostic[] }> {
    const { value, diagnostics } = inspectProject(targetPath);
    return {
      value: {
        vertical: 'xlsx',
        incumbentName: value.manifest.incumbentsFound.exceljs ? 'exceljs' : 'unknown',
        detectedVersion: value.manifest.incumbentsFound.exceljs,
        observedPatterns: value.imports.map((i: any) => i.moduleSpecifier)
      },
      diagnostics
    };
  }

  async evaluateMigrationFeasibility(
    targetPath: string
  ): Promise<{ feasible: boolean; recommendedApproach: 'direct-spawn' | 'facade' | 'manual-refactor' | 'blocked' }> {
    const { value } = inspectProject(targetPath);
    if (value.manifest.incumbentsFound.exceljs || value.manifest.incumbentsFound.xlsx) {
      return { feasible: true, recommendedApproach: 'facade' };
    }
    return { feasible: true, recommendedApproach: 'manual-refactor' };
  }
}

export class FfmpegVerticalAdapter extends VerticalAdapter<VerticalInspectionResult> {
  readonly verticalId = 'ffmpeg';
  readonly capabilities: AdapterCapability[] = [
    {
      id: 'ffmpeg-spawn-probe',
      name: 'Direct Child Process Spawn Adapter',
      vertical: 'ffmpeg',
      supportedOperations: ['probe-usage', 'spawn-recommendation']
    }
  ];

  async inspectTarget(
    targetPath: string,
    context: RunContext
  ): Promise<{ value: VerticalInspectionResult; diagnostics: Diagnostic[] }> {
    const { value, diagnostics } = inspectProject(targetPath);
    return {
      value: {
        vertical: 'ffmpeg',
        incumbentName: 'fluent-ffmpeg',
        detectedVersion: value.manifest.version,
        observedPatterns: ['fluent-ffmpeg']
      },
      diagnostics
    };
  }

  async evaluateMigrationFeasibility(
    targetPath: string
  ): Promise<{ feasible: boolean; recommendedApproach: 'direct-spawn' | 'facade' | 'manual-refactor' | 'blocked' }> {
    return { feasible: true, recommendedApproach: 'direct-spawn' };
  }
}
