import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { inspectXlsx } from '@berryn/xlsx-inspect';

export interface ValidationStageResult {
  passed: boolean;
  stageName: string;
  diagnostics: Diagnostic[];
}

export function validateStructuralIntegrity(buffer: Uint8Array): ValidationStageResult {
  const diagnostics: Diagnostic[] = [];
  let passed = true;

  try {
    const { diagnostics: inspectDiags } = inspectXlsx(buffer);
    diagnostics.push(...inspectDiags);

    const hasCritical = inspectDiags.some((d) => d.severity === 'critical' || d.severity === 'error');
    if (hasCritical) {
      passed = false;
    }
  } catch (err: any) {
    passed = false;
    diagnostics.push(
      createDiagnostic({
        code: DIAGNOSTIC_CODES.VAL_STRUCTURAL_FAILED,
        severity: 'critical',
        message: `Structural validation failed: ${err.message}`,
        remediation: 'Verify file is not corrupted.'
      })
    );
  }

  return {
    passed,
    stageName: 'Structural Validation',
    diagnostics
  };
}
