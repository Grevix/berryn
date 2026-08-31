import { readFileSync } from 'node:fs';
import { createRunContext, createResultEnvelope } from '@berryn/core';
import { buildMigrationReport, renderReportJson, renderReportMarkdown } from '@berryn/migration-report';
import { assertPathInSandbox } from '@berryn/guard';
import { diffXlsxWorkbooks } from '@berryn/xlsx-diff';
import { EXIT_CODES } from '../exit-codes.js';

export interface DiffCommandOptions {
  format?: 'text' | 'json' | 'markdown';
}

export function handleDiffCommand(beforePath: string, afterPath: string, options: DiffCommandOptions): void {
  const context = createRunContext();
  const format = options.format || 'text';

  try {
    const sBefore = assertPathInSandbox(beforePath, context.policy.allowedRoots);
    const sAfter = assertPathInSandbox(afterPath, context.policy.allowedRoots);

    const buf1 = readFileSync(sBefore);
    const buf2 = readFileSync(sAfter);

    const { value, diagnostics } = diffXlsxWorkbooks(buf1, buf2);
    const envelope = createResultEnvelope(value, context.runMetadata, diagnostics);
    const report = buildMigrationReport(envelope, 'diff');

    if (format === 'json') {
      console.log(renderReportJson(report));
    } else {
      console.log(renderReportMarkdown(report));
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (err: any) {
    if (err.name === 'SecurityError') {
      console.error(`[SECURITY ERROR]: ${err.message}`);
      process.exit(EXIT_CODES.ERR_SECURITY);
    }
    console.error(`[DIFF ERROR]: ${err.message}`);
    process.exit(EXIT_CODES.ERR_INTERNAL);
  }
}

