import type { ResourceLimits } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { SecurityError } from './sandbox.js';

export function assertZipBombRatio(
  compressedSize: number,
  uncompressedSize: number,
  maxRatio = 100
): void {
  if (compressedSize <= 0) return;

  const ratio = uncompressedSize / compressedSize;
  if (ratio > maxRatio && uncompressedSize > 10 * 1024 * 1024) {
    const diag = createDiagnostic({
      code: DIAGNOSTIC_CODES.SEC_ZIP_BOMB,
      severity: 'critical',
      message: `ZIP bomb detected: Compression ratio ${ratio.toFixed(1)}:1 exceeds safety limit ${maxRatio}:1 (Uncompressed: ${uncompressedSize} bytes)`,
      remediation: 'Aborting container extraction to prevent resource exhaustion.'
    });
    throw new SecurityError(diag.message, diag);
  }
}
