import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import type { PreservationManifest } from './manifest.js';

export class NoSilentLossError extends Error {
  constructor(partPath: string, reason: string) {
    const diag = createDiagnostic({
      code: DIAGNOSTIC_CODES.XLSX_MUTATION_REJECTED,
      severity: 'critical',
      message: `No Silent Data Loss Invariant Violated for part '${partPath}': ${reason}`,
      remediation: 'Do not mutate workbook without explicit policy override permitting opaque part dropping.'
    });
    super(diag.message);
    this.name = 'NoSilentLossError';
  }
}

export function assertNoSilentLoss(beforeManifest: PreservationManifest, afterManifest: PreservationManifest): void {
  const beforeParts = new Map(beforeManifest.parts.map((p) => [p.partPath, p]));

  for (const [path, beforeState] of beforeParts.entries()) {
    if (beforeState.preservationAction === 'opaque-retained') {
      const afterState = afterManifest.parts.find((p) => p.partPath === path);
      if (!afterState || afterState.preservationAction === 'dropped-rejected') {
        throw new NoSilentLossError(
          path,
          `Opaque part '${path}' was dropped or corrupted during workbook mutation.`
        );
      }
    }
  }
}
