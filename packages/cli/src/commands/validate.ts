import { readFileSync } from 'node:fs';
import type { Diagnostic } from '@berryn/core';
import { createRunContext, createResultEnvelope } from '@berryn/core';
import { buildMigrationReport, renderReportJson, renderReportMarkdown } from '@berryn/migration-report';
import { assertPathInSandbox } from '@berryn/guard';
import { validateRelationshipIntegrity, validateSemanticContents, validateStructuralIntegrity } from '@berryn/xlsx-validate';
import { EXIT_CODES } from '../exit-codes.js';

export interface ValidateCommandOptions {
  format?: 'text' | 'json' | 'markdown';
}

export function handleValidateCommand(inputPath: string, options: ValidateCommandOptions): void {
  const context = createRunContext();
  const format = options.format || 'text';

  try {
    const sPath = assertPathInSandbox(inputPath, context.policy.allowedRoots);
    const buffer = readFileSync(sPath);

    const allDiags: Diagnostic[] = [];

    const res1 = validateStructuralIntegrity(buffer);
    allDiags.push(...res1.diagnostics);

    const res2 = validateRelationshipIntegrity(buffer);
    allDiags.push(...res2.diagnostics);

    const res3 = validateSemanticContents(buffer);
    allDiags.push(...res3.diagnostics);

    const overallPassed = res1.passed && res2.passed && res3.passed;
    const envelope = createResultEnvelope(
      { passed: overallPassed, stages: [res1, res2, res3] },
      context.runMetadata,
      allDiags
    );

    const report = buildMigrationReport(envelope, 'validation');

    if (format === 'json') {
      console.log(renderReportJson(report));
    } else {
      console.log(renderReportMarkdown(report));
    }

    if (!overallPassed || report.summary.deployability === 'blocked') {
      process.exit(EXIT_CODES.ERR_VALIDATION);
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (err: any) {
    if (err.name === 'SecurityError') {
      console.error(`[SECURITY ERROR]: ${err.message}`);
      process.exit(EXIT_CODES.ERR_SECURITY);
    }
    console.error(`[VALIDATE ERROR]: ${err.message}`);
    process.exit(EXIT_CODES.ERR_INTERNAL);
  }
}

