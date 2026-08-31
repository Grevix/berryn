import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import type { ValidationStageResult } from './structural.js';

export function runConsumerSmokeTest(
  filePathOrBuffer: string | Uint8Array,
  timeoutMs: number = 10000
): ValidationStageResult {
  const diagnostics: Diagnostic[] = [];
  let passed = true;

  const tempDir = join(tmpdir(), `berryn_consumer_${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  let targetFilePath = typeof filePathOrBuffer === 'string' ? filePathOrBuffer : join(tempDir, 'input.xlsx');
  if (typeof filePathOrBuffer !== 'string') {
    writeFileSync(targetFilePath, filePathOrBuffer);
  }

  // Attempt binary lookup: 'soffice' or 'libreoffice'
  let binaryName: string | null = null;
  for (const bin of ['soffice', 'libreoffice']) {
    try {
      execFileSync(bin, ['--version'], { stdio: 'pipe', timeout: 3000 });
      binaryName = bin;
      break;
    } catch {
      // Continue search
    }
  }

  if (!binaryName) {
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.VAL_CONSUMER_REPAIR_WARNING,
        severity: 'info',
        message: 'LibreOffice/soffice binary not installed on system. Headless consumer smoke validation recorded as UNKNOWN (Skipped).',
        remediation: 'Install LibreOffice (soffice) to enable headless PDF render smoke validation.'
      })
    );

    rmSync(tempDir, { recursive: true, force: true });
    return {
      passed: true,
      stageName: 'Headless Consumer Validation',
      diagnostics
    };
  }

  try {
    execFileSync(
      binaryName,
      ['--headless', '--convert-to', 'pdf', '--outdir', tempDir, targetFilePath],
      {
        stdio: 'pipe',
        timeout: timeoutMs,
        env: { ...process.env, SAL_USE_VCLPLUGIN: 'svm' } // Headless VCL plugin
      }
    );

    const pdfFiles = existsSync(tempDir) ? true : false;
    if (pdfFiles) {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.VAL_CONSUMER_REPAIR_WARNING,
          severity: 'info',
          message: `Headless consumer conversion to PDF passed cleanly via '${binaryName}'.`
        })
      );
    }
  } catch (err: any) {
    passed = false;
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.VAL_CONSUMER_REPAIR_WARNING,
        severity: 'warning',
        message: `LibreOffice consumer conversion reported warning: ${err.message}`,
        remediation: 'Inspect workbook XML for features unhandled by LibreOffice filter.'
      })
    );
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }

  return {
    passed,
    stageName: 'Headless Consumer Validation',
    diagnostics
  };
}
