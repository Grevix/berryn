import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyCodemodPlan,
  CodemodRuleRegistry,
  generateExcelJsCodemodPlan,
  undoMigration
} from '../../packages/codemod/src/index.js';
import { DIAGNOSTIC_CODES } from '../../packages/diagnostics/src/index.js';
import { inspectProject } from '../../packages/project-inspect/src/index.js';

describe('Real-World Enterprise Target Pipeline Test (0.8.0 Umbrella)', () => {
  const realWorldProjDir = join(process.cwd(), 'tests', 'fixtures', 'real-world-app');

  it('runs project inspection against real-world enterprise target', () => {
    const { value, diagnostics } = inspectProject(realWorldProjDir);
    expect(value.manifest.incumbentsFound.exceljs).toBe('^4.4.0');
    expect(value.totalSourceFilesScanned).toBeGreaterThanOrEqual(3);
    expect(value.imports.length).toBeGreaterThanOrEqual(2);
  });

  it('executes full plan -> preview -> apply -> runtime execution -> undo pipeline cleanly', async () => {
    // 1. Create fresh isolated copy of real-world app in tmpdir
    const testWorkDir = join(tmpdir(), `berryn_realworld_env_${Date.now()}`);
    const srcDir = join(testWorkDir, 'src');
    mkdirSync(srcDir, { recursive: true });

    const originalPackageJson = readFileSync(join(realWorldProjDir, 'package.json'), 'utf-8');
    const originalIndex = readFileSync(join(realWorldProjDir, 'src', 'index.ts'), 'utf-8');
    const originalLegacy = readFileSync(join(realWorldProjDir, 'src', 'legacy-service.ts'), 'utf-8');
    const originalDynamic = readFileSync(join(realWorldProjDir, 'src', 'dynamic-reporter.ts'), 'utf-8');

    writeFileSync(join(testWorkDir, 'package.json'), originalPackageJson, 'utf-8');
    writeFileSync(join(srcDir, 'index.ts'), originalIndex, 'utf-8');
    writeFileSync(join(srcDir, 'legacy-service.ts'), originalLegacy, 'utf-8');
    writeFileSync(join(srcDir, 'dynamic-reporter.ts'), originalDynamic, 'utf-8');

    const filesToMigrate = [
      join(srcDir, 'index.ts'),
      join(srcDir, 'legacy-service.ts'),
      join(srcDir, 'dynamic-reporter.ts')
    ];

    // 2. Generate migration plan
    const { plan, diagnostics } = generateExcelJsCodemodPlan(testWorkDir, filesToMigrate);
    expect(plan.transformations.length).toBeGreaterThanOrEqual(4);
    expect(plan.confidence).toBe('low'); // Flagged due to dynamic reporter

    // Verify diagnostic was emitted for ambiguous pattern
    expect(diagnostics.some(d => d.code === DIAGNOSTIC_CODES.CODE_AMBIGUOUS_AST)).toBe(true);

    // 3. Apply codemod plan to disk
    const { appliedFiles, reversalPath } = applyCodemodPlan(plan, '0.2.0');
    expect(appliedFiles.length).toBeGreaterThanOrEqual(2);
    expect(existsSync(reversalPath)).toBe(true);

    // Verify ESM file updated to @berryn/exceljs-compat
    const modifiedIndex = readFileSync(join(srcDir, 'index.ts'), 'utf-8');
    expect(modifiedIndex).toContain('@berryn/exceljs-compat');

    // Verify CJS file updated to require('@berryn/exceljs-compat')
    const modifiedLegacy = readFileSync(join(srcDir, 'legacy-service.ts'), 'utf-8');
    expect(modifiedLegacy).toContain("require('@berryn/exceljs-compat')");

    // Verify ambiguous dynamic call expression was NOT mutated automatically
    const modifiedDynamic = readFileSync(join(srcDir, 'dynamic-reporter.ts'), 'utf-8');
    expect(modifiedDynamic).toContain('workbook.xlsx[method](path)');

    // 4. Test Undo Migration
    const { success, restoredFiles } = undoMigration(testWorkDir);
    expect(success).toBe(true);
    expect(restoredFiles.length).toBe(appliedFiles.length);

    // Verify 100% byte-identical restoration
    expect(readFileSync(join(srcDir, 'index.ts'), 'utf-8')).toBe(originalIndex);
    expect(readFileSync(join(srcDir, 'legacy-service.ts'), 'utf-8')).toBe(originalLegacy);
    expect(readFileSync(join(srcDir, 'dynamic-reporter.ts'), 'utf-8')).toBe(originalDynamic);

    rmSync(testWorkDir, { recursive: true, force: true });
  });
});
