import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applyCodemodPlan, generateExcelJsCodemodPlan, undoMigration } from '../../packages/codemod/src/index.js';
import { assertPathInSandbox, assertSafeXmlPayload, assertZipBombRatio } from '../../packages/security/src/index.js';

describe('Adversarial Security Red-Team & Failure Injection Suite', () => {
  it('blocks path traversal attempt escaping sandbox root (Linux style)', () => {
    const root = join(tmpdir(), 'sandbox_root_linux');
    mkdirSync(root, { recursive: true });
    expect(() => assertPathInSandbox(join(root, '..', 'etc', 'passwd'), [root])).toThrow(/Path traversal violation/);
    rmSync(root, { recursive: true, force: true });
  });

  it('blocks path traversal attempt escaping sandbox root (Windows style)', () => {
    const root = join(tmpdir(), 'sandbox_root_win');
    mkdirSync(root, { recursive: true });
    expect(() => assertPathInSandbox('C:\\..\\Windows\\System32\\cmd.exe', [root])).toThrow(/Path traversal violation/);
    rmSync(root, { recursive: true, force: true });
  });

  it('blocks absolute path escaping sandbox root', () => {
    const root = join(tmpdir(), 'sandbox_root_abs');
    mkdirSync(root, { recursive: true });
    const outsidePath = process.platform === 'win32' ? 'C:\\Windows\\System32' : '/etc/hosts';
    expect(() => assertPathInSandbox(outsidePath, [root])).toThrow(/Path traversal violation/);
    rmSync(root, { recursive: true, force: true });
  });

  it('blocks ZIP bomb expansion exceeding 100:1 ratio', () => {
    const compressedBytes = 100;
    const uncompressedBytes = 15 * 1024 * 1024; // 15MB > 10MB threshold and > 100:1 ratio
    expect(() => assertZipBombRatio(compressedBytes, uncompressedBytes)).toThrow(/ZIP bomb detected/);
  });

  it('blocks XXE external entity expansion payload in XML parsing', () => {
    const xxePayload = `<?xml version="1.0"?>
    <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
    <workbook>&xxe;</workbook>`;
    expect(() => assertSafeXmlPayload(xxePayload)).toThrow(/XXE Payload Detected/);
  });

  it('blocks XInclude external file inclusion directive', () => {
    const xincludePayload = `<?xml version="1.0"?>
    <workbook xmlns:xi="http://www.w3.org/2001/XInclude">
      <xi:include href="file:///etc/passwd"/>
    </workbook>`;
    expect(() => assertSafeXmlPayload(xincludePayload)).toThrow(/XInclude Payload Detected/);
  });

  it('blocks deeply nested XML payloads exceeding safety depth limit', () => {
    let deepXml = '<root>';
    for (let i = 0; i < 120; i++) {
      deepXml += `<level${i}>`;
    }
    deepXml += 'value';
    for (let i = 119; i >= 0; i--) {
      deepXml += `</level${i}>`;
    }
    deepXml += '</root>';

    expect(() => assertSafeXmlPayload(deepXml, 10 * 1024 * 1024, 100)).toThrow(/XML nesting depth/);
  });

  it('blocks oversized XML payload exceeding memory threshold', () => {
    const oversizedXml = '<root>' + 'A'.repeat(1000) + '</root>';
    expect(() => assertSafeXmlPayload(oversizedXml, 500, 100)).toThrow(/XML payload size/);
  });

  it('blocks undo migration if target source file was tampered after apply', () => {
    const tempDir = join(tmpdir(), `berryn_tamper_test_${Date.now()}`);
    const srcDir = join(tempDir, 'src');
    mkdirSync(srcDir, { recursive: true });

    const appPath = join(srcDir, 'app.ts');
    const originalCode = `import ExcelJS from 'exceljs';\nconst wb = new ExcelJS.Workbook();\n`;
    writeFileSync(appPath, originalCode, 'utf-8');

    // 1. Generate & Apply migration
    const { plan } = generateExcelJsCodemodPlan(tempDir, [appPath]);
    const { appliedFiles } = applyCodemodPlan(plan, '0.2.0');
    expect(appliedFiles.length).toBe(1);

    // 2. Tamper with the applied file manually
    const tamperedCode = `import ExcelJS from '@berryn/exceljs-compat';\n// Tampered line added by user\nconst wb = new ExcelJS.Workbook();\n`;
    writeFileSync(appPath, tamperedCode, 'utf-8');

    // 3. Attempt Undo Migration -> MUST fail and block restoration
    const { success, restoredFiles, diagnostics } = undoMigration(tempDir);
    expect(success).toBe(false);
    expect(restoredFiles.length).toBe(0);
    expect(diagnostics[0].message).toContain('UNDO BLOCKED');

    rmSync(tempDir, { recursive: true, force: true });
  });
});
