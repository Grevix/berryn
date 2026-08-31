import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  createDisposableWorktree,
  createUnifiedPatch,
  generateExcelJsCodemodPlan
} from '../../packages/codemod/src/index.js';

describe('@berryn/codemod', () => {
  const sampleProjDir = join(process.cwd(), 'tests', 'fixtures', 'sample-project');
  const sampleIndexPath = join(sampleProjDir, 'src', 'index.ts');

  it('generates AST codemod plan rewriting exceljs import specifiers', () => {
    const { plan, diagnostics } = generateExcelJsCodemodPlan(sampleProjDir, [sampleIndexPath]);
    expect(plan.transformations.length).toBe(1);
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
});
