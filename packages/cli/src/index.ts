#!/usr/bin/env node
import { Command } from 'commander';
import { handleDiffCommand } from './commands/diff.js';
import { handleInspectCommand } from './commands/inspect.js';
import { handleMigrateCommand } from './commands/migrate.js';
import { handleReportCommand } from './commands/report.js';
import { handleValidateCommand } from './commands/validate.js';

const program = new Command();

program
  .name('berryn')
  .description('Berryn — Migration, compatibility, and validation infrastructure CLI')
  .version('0.2.0');

program
  .command('inspect <path>')
  .description('Inventory declared project dependencies or XLSX container package parts')
  .option('--project', 'Inspect project codebase manifest and imports')
  .option('--format <format>', 'Output format (text, json, markdown)', 'text')
  .action((path, options) => {
    handleInspectCommand(path, options);
  });

program
  .command('diff <before> <after>')
  .description('Compute package ZIP diff and normalized semantic diff between workbooks')
  .option('--format <format>', 'Output format (text, json, markdown)', 'text')
  .action((before, after, options) => {
    handleDiffCommand(before, after, options);
  });

program
  .command('validate <input>')
  .description('Validate structural, OPC relationship, and semantic integrity of workbook')
  .option('--format <format>', 'Output format (text, json, markdown)', 'text')
  .action((input, options) => {
    handleValidateCommand(input, options);
  });

program
  .command('migrate <project>')
  .description('Generate AST-driven codemod migration plan, patch preview, apply, or undo')
  .option('--from <incumbent>', 'Incumbent package name (exceljs, xlsx)', 'exceljs')
  .option('--plan-only', 'Generate migration plan without patch text preview', false)
  .option('--dry-run', 'Preview transformations without modifying files', true)
  .option('--apply', 'Apply codemod transformations to files and record reversal state', false)
  .option('--undo', 'Revert latest applied migration using reversal record', false)
  .option('--worktree', 'Run migration inside isolated disposable Git worktree', false)
  .option('--format <format>', 'Output format (text, json, markdown)', 'text')
  .action((project, options) => {
    handleMigrateCommand(project, options);
  });

program
  .command('report <path>')
  .description('Render human-readable Markdown summary from JSON report artifact')
  .action((path) => {
    handleReportCommand(path);
  });

program.parse(process.argv);
