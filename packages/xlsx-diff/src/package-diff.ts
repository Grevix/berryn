import type { ContentHash } from '@berryn/core';
import type { XlsxInspectionReport } from '@berryn/xlsx-inspect';

export interface EntryDiffItem {
  path: string;
  kind: 'added' | 'removed' | 'modified' | 'identical';
  hashBefore?: ContentHash;
  hashAfter?: ContentHash;
}

export interface PackageDiffResult {
  hasDifferences: boolean;
  addedParts: string[];
  removedParts: string[];
  modifiedParts: string[];
  identicalParts: string[];
  entryDiffs: EntryDiffItem[];
}

export function diffPackageArchives(
  beforeReport: XlsxInspectionReport,
  afterReport: XlsxInspectionReport
): PackageDiffResult {
  const beforeMap = new Map(beforeReport.parts.map((p) => [p.partPath, p]));
  const afterMap = new Map(afterReport.parts.map((p) => [p.partPath, p]));

  const addedParts: string[] = [];
  const removedParts: string[] = [];
  const modifiedParts: string[] = [];
  const identicalParts: string[] = [];
  const entryDiffs: EntryDiffItem[] = [];

  for (const [path, afterPart] of afterMap.entries()) {
    const beforePart = beforeMap.get(path);
    if (!beforePart) {
      addedParts.push(path);
      entryDiffs.push({ path, kind: 'added' });
    } else if (beforePart.contentType !== afterPart.contentType) {
      modifiedParts.push(path);
      entryDiffs.push({ path, kind: 'modified' });
    } else {
      identicalParts.push(path);
      entryDiffs.push({ path, kind: 'identical' });
    }
  }

  for (const [path] of beforeMap.entries()) {
    if (!afterMap.has(path)) {
      removedParts.push(path);
      entryDiffs.push({ path, kind: 'removed' });
    }
  }

  const hasDifferences = addedParts.length > 0 || removedParts.length > 0 || modifiedParts.length > 0;

  return {
    hasDifferences,
    addedParts,
    removedParts,
    modifiedParts,
    identicalParts,
    entryDiffs
  };
}
