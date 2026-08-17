import { readFileSync } from 'node:fs';
import { createRunContext, createResultEnvelope } from '@berryn/core';
import { buildMigrationReport, renderReportJson, renderReportMarkdown } from '@berryn/migration-report';
import { inspectProject } from '@berryn/project-inspect';
import { assertPathInSandbox } from '@berryn/security';
import { inspectXlsx } from '@berryn/xlsx-inspect';
import { EXIT_CODES } from '../exit-codes.js';

export interface InspectCommandOptions {
  project?: boolean;
  format?: 'text' | 'json' | 'markdown';
}

export function handleInspectCommand(targetPath: string, options: InspectCommandOptions): void {
  const context = createRunContext();
  const format = options.format || 'text';

  try {
    const sanitizedPath = assertPathInSandbox(targetPath, context.policy.allowedRoots);

    if (options.project) {
      const { value, diagnostics } = inspectProject(sanitizedPath);
      const envelope = createResultEnvelope(value, context.runMetadata, diagnostics);
      const report = buildMigrationReport(envelope, 'inspection');

      if (format === 'json') {
        console.log(renderReportJson(report));
      } else {
        console.log(renderReportMarkdown(report));
      }
    } else {
      const buffer = readFileSync(sanitizedPath);
      const { value, diagnostics } = inspectXlsx(buffer, context.policy.limits);
      const envelope = createResultEnvelope(value, context.runMetadata, diagnostics);
      const report = buildMigrationReport(envelope, 'inspection');

      if (format === 'json') {
        console.log(renderReportJson(report));
      } else {
        console.log(renderReportMarkdown(report));
      }
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (err: any) {
    if (err.name === 'SecurityError') {
      console.error(`[SECURITY ERROR]: ${err.message}`);
      process.exit(EXIT_CODES.ERR_SECURITY);
    }
    console.error(`[INSPECT ERROR]: ${err.message}`);
    process.exit(EXIT_CODES.ERR_INTERNAL);
  }
}
