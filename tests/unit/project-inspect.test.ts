import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIAGNOSTIC_CODES } from '../../packages/diagnostics/src/index.js';
import {
  findSourceFiles,
  inspectPackageManifest,
  inspectProject,
  scanSourceFileAst
} from '../../packages/project-inspect/src/index.js';

describe('@berryn/project-inspect', () => {
  const sampleProjDir = join(process.cwd(), 'tests', 'fixtures', 'sample-project');

  it('inspects package manifest and detects incumbent dependencies', () => {
    const { manifest, diagnostics } = inspectPackageManifest(sampleProjDir);
    expect(manifest.name).toBe('sample-legacy-project');
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.incumbentsFound.exceljs).toBe('^4.4.0');
    expect(diagnostics.some(d => d.code === DIAGNOSTIC_CODES.PROJ_INCUMBENT_DETECTED)).toBe(true);
  });

  it('discovers source files recursively while ignoring build directories', () => {
    const files = findSourceFiles(sampleProjDir);
    expect(files.length).toBeGreaterThanOrEqual(2);
    expect(files.some(f => f.endsWith('index.ts'))).toBe(true);
    expect(files.some(f => f.endsWith('utils.ts'))).toBe(true);
  });

  it('scans AST import declarations and method call sites', () => {
    const indexPath = join(sampleProjDir, 'src', 'index.ts');
    const { imports, calls } = scanSourceFileAst(indexPath);

    expect(imports.length).toBe(1);
    expect(imports[0].packageName).toBe('exceljs');
    expect(calls.some(c => c.methodName === 'readFile')).toBe(true);
  });

  it('inspects entire project and produces combined inspection result', () => {
    const { value, diagnostics } = inspectProject(sampleProjDir);
    expect(value.manifest.name).toBe('sample-legacy-project');
    expect(value.totalSourceFilesScanned).toBeGreaterThanOrEqual(2);
    expect(value.imports.length).toBeGreaterThanOrEqual(2);
  });
});
