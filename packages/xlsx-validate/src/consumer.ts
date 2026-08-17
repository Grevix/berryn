import { execFileSync } from 'node:child_process';
import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import type { ValidationStageResult } from './structural.js';

export function runConsumerSmokeTest(filePath: string): ValidationStageResult {
  const diagnostics: Diagnostic[] = [];
  let passed = true;

  try {
    // Check if libreoffice binary exists
    execFileSync('libreoffice', ['--headless', '--convert-to', 'pdf', '--outdir', '/tmp', filePath], {
      stdio: 'pipe',
      timeout: 10000
    });
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.VAL_CONSUMER_REPAIR_WARNING,
          severity: 'info',
          message: 'LibreOffice binary not found locally. Headless consumer validation skipped.'
        })
      );
    } else {
      passed = false;
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.VAL_CONSUMER_REPAIR_WARNING,
          severity: 'warning',
          message: `LibreOffice consumer validation warning: ${err.message}`
        })
      );
    }
  }

  return {
    passed,
    stageName: 'Headless Consumer Validation',
    diagnostics
  };
}
