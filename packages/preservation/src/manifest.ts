import type { ContentHash } from '@berryn/core';
import type { XlsxInspectionReport } from '@berryn/xlsx-inspect';

export interface PartPreservationState {
  partPath: string;
  contentType: string;
  preservationAction: 'byte-preserved' | 'semantically-rewritten' | 'opaque-retained' | 'dropped-rejected';
  originalHash: ContentHash;
}

export interface PreservationManifest {
  manifestId: string;
  createdAt: string;
  totalParts: number;
  preservedPartCount: number;
  unmodeledOpaqueCount: number;
  parts: PartPreservationState[];
}

export function computePreservationManifest(report: XlsxInspectionReport): PreservationManifest {
  const parts: PartPreservationState[] = report.parts.map((p) => {
    let action: PartPreservationState['preservationAction'] = 'byte-preserved';
    if (p.classification === 'preserved-not-modeled') {
      action = 'opaque-retained';
    } else if (p.classification === 'unsupported' || p.classification === 'rejected') {
      action = 'dropped-rejected';
    }

    return {
      partPath: p.partPath,
      contentType: p.contentType,
      preservationAction: action,
      originalHash: `hash_${p.partPath.length}` as ContentHash
    };
  });

  const preservedCount = parts.filter((p) => p.preservationAction !== 'dropped-rejected').length;
  const opaqueCount = parts.filter((p) => p.preservationAction === 'opaque-retained').length;

  return {
    manifestId: `pm_${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalParts: parts.length,
    preservedPartCount: preservedCount,
    unmodeledOpaqueCount: opaqueCount,
    parts
  };
}
