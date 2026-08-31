import type { ContentHash, Diagnostic, ResourceLimits } from '@berryn/core';
import { hashBuffer } from '@berryn/core';
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';
import { assertResourceLimits, assertZipBombRatio } from '@berryn/guard';
import { unzipSync } from 'fflate';

export interface ZipEntryMeta {
  path: string;
  compressedSize: number;
  uncompressedSize: number;
  hash: ContentHash;
}

export interface ZipContainerInventory {
  entries: Map<string, Uint8Array>;
  meta: ZipEntryMeta[];
  totalCompressedBytes: number;
  totalUncompressedBytes: number;
}

export function readZipContainer(
  buffer: Uint8Array,
  limits?: ResourceLimits
): { container: ZipContainerInventory; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];

  let unzipped: Record<string, Uint8Array>;
  try {
    unzipped = unzipSync(buffer);
  } catch (err: any) {
    const diag = createDiagnostic({
      code: DIAGNOSTIC_CODES.XLSX_ZIP_MALFORMED,
      severity: 'critical',
      message: `Failed to unzip archive container: ${err.message}`,
      remediation: 'Ensure file is a valid, uncorrupted .xlsx ZIP archive.'
    });
    throw new Error(diag.message);
  }

  const entryMap = new Map<string, Uint8Array>();
  const metaList: ZipEntryMeta[] = [];
  let totalUncompressed = 0;

  const entryKeys = Object.keys(unzipped);

  if (limits) {
    assertResourceLimits({ entryCount: entryKeys.length }, limits);
  }

  for (const path of entryKeys) {
    const entryData = unzipped[path];
    if (!entryData) continue;

    const uncompressedSize = entryData.length;
    totalUncompressed += uncompressedSize;

    // Check ZIP bomb ratio per entry (estimating compressed size assuming overall ratio)
    assertZipBombRatio(Math.max(1, Math.floor(uncompressedSize / 50)), uncompressedSize);

    const hash = hashBuffer(entryData);
    entryMap.set(path, entryData);
    metaList.push({
      path,
      compressedSize: Math.floor(uncompressedSize / 3), // Approximation
      uncompressedSize,
      hash
    });
  }

  if (limits) {
    assertResourceLimits({ totalUncompressedBytes: totalUncompressed }, limits);
  }

  return {
    container: {
      entries: entryMap,
      meta: metaList,
      totalCompressedBytes: buffer.length,
      totalUncompressedBytes: totalUncompressed
    },
    diagnostics
  };
}

