import type { Diagnostic } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { inspectXlsx, type XlsxInspectionReport } from '@berryn/xlsx-inspect';
import { diffPackageArchives, type PackageDiffResult } from './package-diff.js';
import { areXmlStringsEquivalent } from './xml-diff.js';

export interface FullDiffResult {
  packageDiff: PackageDiffResult;
  semanticChangesCount: number;
  semanticSummary: string;
}

export function diffXlsxWorkbooks(
  beforeBuffer: Uint8Array,
  afterBuffer: Uint8Array
): { value: FullDiffResult; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];

  const { value: beforeReport, diagnostics: d1 } = inspectXlsx(beforeBuffer);
  const { value: afterReport, diagnostics: d2 } = inspectXlsx(afterBuffer);
  diagnostics.push(...d1, ...d2);

  const pkgDiff = diffPackageArchives(beforeReport, afterReport);

  let semanticChanges = 0;

  if (pkgDiff.hasDifferences) {
    if (pkgDiff.modifiedParts.length > 0) {
      semanticChanges += pkgDiff.modifiedParts.length;
      diagnostics.push(
        createDiagnostic({
          code: DIAGNOSTIC_CODES.XLSX_SEMANTIC_MISMATCH,
          severity: 'info',
          message: `Package diff detected ${pkgDiff.modifiedParts.length} modified parts and ${pkgDiff.addedParts.length} added parts.`
        })
      );
    }
  }

  const summary = pkgDiff.hasDifferences
    ? `Differences detected: ${pkgDiff.addedParts.length} added, ${pkgDiff.removedParts.length} removed, ${pkgDiff.modifiedParts.length} modified parts.`
    : 'Identical workbooks (No package or semantic differences detected).';

  return {
    value: {
      packageDiff: pkgDiff,
      semanticChangesCount: semanticChanges,
      semanticSummary: summary
    },
    diagnostics
  };
}
