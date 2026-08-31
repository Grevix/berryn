import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applyCodemodPlan,
  CodemodRuleRegistry,
  createDisposableWorktree,
  createUnifiedPatch,
  generateExcelJsCodemodPlan,
  undoMigration
} from '../../packages/codemod/src/index.js';
import { DIAGNOSTIC_CODES } from '../../packages/diagnostics/src/index.js';

describe('@berryn/codemod engine & rules', () => {
  const sampleProjDir = join(process.cwd(), 'tests', 'fixtures', 'sample-project');
  const sampleIndexPath = join(sampleProjDir, 'src', 'index.ts');

  it('lists default registered codemod rules', () => {
    const registry = new CodemodRuleRegistry();
    const rules = registry.list();
    expect(rules.length).toBeGreaterThanOrEqual(3);
    expect(rules.some(r => r.id === 'BRN-CODEMOD-IMPORT-EXCELJS')).toBe(true);
    expect(rules.some(r => r.id === 'BRN-CODEMOD-REQUIRE-EXCELJS')).toBe(true);
    expect(rules.some(r => r.id === 'BRN-CODEMOD-AMBIGUOUS-EXPR')).toBe(true);
  });

  it('generates AST codemod plan rewriting exceljs import specifiers', () => {
    const { plan, diagnostics } = generateExcelJsCodemodPlan(sampleProjDir, [sampleIndexPath]);
    expect(plan.transformations.length).toBeGreaterThanOrEqual(1);
    expect(plan.transformations[0].kind).toBe('import-rewrite');
    expect(plan.transformations[0].replacementText).toContain('@berryn/exceljs-compat');
  });

  it('creates unified patch string from codemod plan', () => {
    const { plan } = generateExcelJsCodemodPlan(sampleProjDir, [sampleIndexPath]);
    const patch = createUnifiedPatch(plan);
    expect(patch).toContain('--- a/');
    expect(patch).toContain('+++ b/');
    expect(patch).toContain('@berryn/exceljs-compat');
  });

  it('preserves reversal invariant: apply(migration) -> undo(migration) -> original content', () => {
    const tempDir = join(tmpdir(), `berryn_codemod_test_${Date.now()}`);
    const tempSrcDir = join(tempDir, 'src');
    mkdirSync(tempSrcDir, { recursive: true });

    const tempFile = join(tempSrcDir, 'app.ts');
    const originalCode = `import ExcelJS from 'exceljs';\n\nexport function test() { return new ExcelJS.Workbook(); }\n`;
    writeFileSync(tempFile, originalCode, 'utf-8');

    // 1. Generate plan
    const { plan } = generateExcelJsCodemodPlan(tempDir, [tempFile]);
    expect(plan.transformations.length).toBeGreaterThanOrEqual(1);

    // 2. Apply plan
    const { appliedFiles, reversalPath } = applyCodemodPlan(plan, '0.2.0');
    expect(appliedFiles.length).toBe(1);
    expect(existsSync(reversalPath)).toBe(true);

    const modifiedCode = readFileSync(tempFile, 'utf-8');
    expect(modifiedCode).toContain('@berryn/exceljs-compat');

    // 3. Undo plan
    const { success, restoredFiles } = undoMigration(tempDir);
    expect(success).toBe(true);
    expect(restoredFiles.length).toBe(1);

    const restoredCode = readFileSync(tempFile, 'utf-8');
    expect(restoredCode).toBe(originalCode);

    rmSync(tempDir, { recursive: true, force: true });
  });

  it('detects ambiguous pattern expressions and emits diagnostic without modifying code', () => {
    const tempDir = join(tmpdir(), `berryn_ambiguous_test_${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });

    const tempFile = join(tempDir, 'dynamic.ts');
    const ambiguousCode = `const method = 'readFile';\nworkbook.xlsx[method]('file.xlsx');\n`;
    writeFileSync(tempFile, ambiguousCode, 'utf-8');

    const { plan, diagnostics } = generateExcelJsCodemodPlan(tempDir, [tempFile]);
    expect(plan.confidence).toBe('low');
    expect(diagnostics.some(d => d.code === DIAGNOSTIC_CODES.CODE_AMBIGUOUS_AST)).toBe(true);

    rmSync(tempDir, { recursive: true, force: true });
  });
});
