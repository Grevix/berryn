import { readFileSync, writeFileSync } from 'node:fs';
import type { Confidence, Diagnostic } from '@berryn/core';
import { hashString } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { createRequire } from 'module';
import { CodemodRuleRegistry, type CodemodRuleResult } from './rules.js';
import { saveReversalRecord, type FileReversalItem, type ReversalRecord } from './reversal.js';

const require = createRequire(import.meta.url);
const tsMorph = require('ts-morph');
const { Project } = tsMorph;

export interface TransformationStep {
  file: string;
  line: number;
  kind: 'import-rewrite' | 'api-replace' | 'ambiguous-pattern';
  ruleId: string;
  originalText: string;
  replacementText: string;
  reversible: boolean;
  manualStepRequired?: string | undefined;
}

export interface CodemodPlan {
  planId: string;
  targetProjectRoot: string;
  transformations: TransformationStep[];
  confidence: Confidence;
  manualSteps: string[];
}

export function generateExcelJsCodemodPlan(
  projectRoot: string,
  sourceFilePaths: string[],
  registry?: CodemodRuleRegistry
): { plan: CodemodPlan; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const transformations: TransformationStep[] = [];
  const manualSteps: string[] = [];
  const ruleRegistry = registry ?? new CodemodRuleRegistry();

  const project = new Project({
    compilerOptions: { allowJs: true }
  });

  for (const filePath of sourceFilePaths) {
    try {
      const sourceFile = project.addSourceFileAtPath(filePath);
      const { results, diagnostics: ruleDiags } = ruleRegistry.executeRules({
        filePath,
        sourceFile
      });

      diagnostics.push(...ruleDiags);

      for (const res of results) {
        transformations.push({
          file: res.file,
          line: res.line,
          kind: res.kind,
          ruleId: res.ruleId,
          originalText: res.originalText,
          replacementText: res.replacementText,
          reversible: res.reversible,
          manualStepRequired: res.manualStepRequired
        });

        if (res.manualStepRequired) {
          manualSteps.push(res.manualStepRequired);
        }
      }
    } catch (err: any) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
          severity: 'warning',
          message: `Could not parse AST for file '${filePath}': ${err.message}`,
          location: { file: filePath }
        })
      );
    }
  }

  const hasAmbiguous = transformations.some(t => t.kind === 'ambiguous-pattern');
  const confidence: Confidence = hasAmbiguous ? 'low' : (transformations.length > 0 ? 'high' : 'medium');

  return {
    plan: {
      planId: `plan_${Date.now()}`,
      targetProjectRoot: projectRoot,
      transformations,
      confidence,
      manualSteps
    },
    diagnostics
  };
}

export function applyCodemodPlan(
  plan: CodemodPlan,
  toolVersion: string = '0.2.0'
): { appliedFiles: string[]; reversalPath: string; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const fileMap = new Map<string, TransformationStep[]>();

  for (const t of plan.transformations) {
    if (t.kind === 'ambiguous-pattern') continue; // Do not apply ambiguous pattern rewrites automatically
    const existing = fileMap.get(t.file) || [];
    existing.push(t);
    fileMap.set(t.file, existing);
  }

  const fileReversals: FileReversalItem[] = [];
  const appliedFiles: string[] = [];

  for (const [filePath, steps] of fileMap.entries()) {
    try {
      const originalContent = readFileSync(filePath, 'utf-8');
      const originalHash = hashString(originalContent);

      // Re-parse with ts-morph to perform clean AST save
      const project = new Project({ compilerOptions: { allowJs: true } });
      const sourceFile = project.addSourceFileAtPath(filePath);
      const registry = new CodemodRuleRegistry();
      registry.executeRules({ filePath, sourceFile });

      sourceFile.saveSync();
      const modifiedContent = readFileSync(filePath, 'utf-8');
      const modifiedHash = hashString(modifiedContent);

      let patchText = `--- a/${filePath}\n+++ b/${filePath}\n`;
      for (const s of steps) {
        patchText += `@@ -${s.line},1 +${s.line},1 @@\n-${s.originalText}\n+${s.replacementText}\n`;
      }

      fileReversals.push({
        filePath,
        originalHash,
        originalContent,
        modifiedHash,
        modifiedContent,
        patch: patchText
      });

      appliedFiles.push(filePath);
    } catch (err: any) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.CODE_TRANSFORM_FAILED,
          severity: 'error',
          message: `Failed to apply codemod transformations to '${filePath}': ${err.message}`,
          location: { file: filePath }
        })
      );
    }
  }

  const reversalRecord: ReversalRecord = {
    runId: plan.planId.replace('plan_', ''),
    timestamp: new Date().toISOString(),
    projectRoot: plan.targetProjectRoot,
    toolVersion,
    fileReversals
  };

  const reversalPath = saveReversalRecord(plan.targetProjectRoot, reversalRecord);

  return { appliedFiles, reversalPath, diagnostics };
}
