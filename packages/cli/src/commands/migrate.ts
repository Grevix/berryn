import {
  applyCodemodPlan,
  createDisposableWorktree,
  createUnifiedPatch,
  generateExcelJsCodemodPlan,
  undoMigration
} from '@berryn/codemod';
import { createResultEnvelope, createRunContext } from '@berryn/core';
import { buildMigrationReport, renderReportJson, renderReportMarkdown } from '@berryn/migration-report';
import { findSourceFiles } from '@berryn/project-inspect';
import { assertPathInSandbox } from '@berryn/guard';
import { EXIT_CODES } from '../exit-codes.js';

export interface MigrateCommandOptions {
  from?: string;
  planOnly?: boolean;
  dryRun?: boolean;
  apply?: boolean;
  undo?: boolean;
  worktree?: boolean;
  format?: 'text' | 'json' | 'markdown';
}

export function handleMigrateCommand(projectPath: string, options: MigrateCommandOptions): void {
  const context = createRunContext();
  const format = options.format || 'text';

  try {
    const sPath = assertPathInSandbox(projectPath, context.policy.allowedRoots);

    // 1. Handle Undo Migration
    if (options.undo) {
      const { success, restoredFiles, diagnostics: undoDiags } = undoMigration(sPath);
      const envelope = createResultEnvelope(
        { action: 'undo', success, restoredFiles },
        context.runMetadata,
        undoDiags
      );
      const report = buildMigrationReport(envelope, 'migration');

      if (format === 'json') {
        console.log(renderReportJson(report));
      } else {
        console.log(renderReportMarkdown(report));
        if (success) {
          console.log(`\nâœ… Migration successfully undone. Restored ${restoredFiles.length} files.`);
        } else {
          console.error(`\nâŒ Migration undo failed: ${undoDiags.map(d => d.message).join('\n')}`);
        }
      }
      process.exit(success ? EXIT_CODES.SUCCESS : EXIT_CODES.ERR_VALIDATION);
    }

    // 2. Worktree Execution Mode
    let targetPath = sPath;
    let worktreeSession: ReturnType<typeof createDisposableWorktree> | undefined;

    if (options.worktree) {
      try {
        worktreeSession = createDisposableWorktree(sPath);
        targetPath = worktreeSession.worktreePath;
        console.log(`[WORKTREE]: Isolated migration branch created at '${targetPath}' (${worktreeSession.branchName})`);
      } catch (err: any) {
        console.warn(`[WORKTREE WARNING]: ${err.message}. Defaulting to sandbox path.`);
      }
    }

    const sourceFiles = findSourceFiles(targetPath);
    const { plan, diagnostics } = generateExcelJsCodemodPlan(targetPath, sourceFiles);
    const patchText = createUnifiedPatch(plan);

    // 3. Handle Apply Mode
    let appliedFiles: string[] = [];
    let reversalPath: string = '';

    if (options.apply) {
      const result = applyCodemodPlan(plan, context.runMetadata.toolVersion);
      appliedFiles = result.appliedFiles;
      reversalPath = result.reversalPath;
      diagnostics.push(...result.diagnostics);
      console.log(`[APPLY]: Applied migration to ${appliedFiles.length} files. Reversal record saved to '${reversalPath}'.`);
    }

    const envelope = createResultEnvelope(
      {
        plan,
        patchPreview: patchText,
        appliedFiles,
        reversalPath,
        worktreeBranch: worktreeSession?.branchName
      },
      context.runMetadata,
      diagnostics
    );
    const report = buildMigrationReport(envelope, 'migration');

    if (format === 'json') {
      console.log(renderReportJson(report));
    } else {
      console.log(renderReportMarkdown(report));
      if (!options.planOnly) {
        console.log('\n--- UNIFIED PATCH PREVIEW ---\n');
        console.log(patchText);
      }
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

