import { createUnifiedPatch, generateExcelJsCodemodPlan } from '@berryn/codemod';
import { createRunContext, createResultEnvelope } from '@berryn/core';
import { buildMigrationReport, renderReportJson, renderReportMarkdown } from '@berryn/migration-report';
import { assertPathInSandbox } from '@berryn/security';
import { EXIT_CODES } from '../exit-codes.js';

export interface MigrateCommandOptions {
  from?: string;
  dryRun?: boolean;
  format?: 'text' | 'json' | 'markdown';
}

export function handleMigrateCommand(projectPath: string, options: MigrateCommandOptions): void {
  const context = createRunContext();
  const format = options.format || 'text';

  try {
    const sPath = assertPathInSandbox(projectPath, context.policy.allowedRoots);
    const { plan, diagnostics } = generateExcelJsCodemodPlan(sPath, []);

    const patchText = createUnifiedPatch(plan);
    const envelope = createResultEnvelope(
      { plan, patchPreview: patchText },
      context.runMetadata,
      diagnostics
    );
    const report = buildMigrationReport(envelope, 'migration');

    if (format === 'json') {
      console.log(renderReportJson(report));
    } else {
      console.log(renderReportMarkdown(report));
      console.log('\n--- UNIFIED PATCH PREVIEW ---\n');
      console.log(patchText);
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (err: any) {
    if (err.name === 'SecurityError') {
      console.error(`[SECURITY ERROR]: ${err.message}`);
      process.exit(EXIT_CODES.ERR_SECURITY);
    }
    console.error(`[MIGRATE ERROR]: ${err.message}`);
    process.exit(EXIT_CODES.ERR_INTERNAL);
  }
}
