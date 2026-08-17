import { describe, expect, it } from 'vitest';
import { assertNoSilentLoss, computePreservationManifest, NoSilentLossError } from '../../packages/preservation/src/index.js';

describe('@berryn/preservation', () => {
  it('computes preservation manifest correctly', () => {
    const report = {
      containerMeta: { totalCompressedBytes: 100, totalUncompressedBytes: 300, totalEntries: 2 },
      parts: [
        { partPath: 'xl/worksheets/sheet1.xml', contentType: 'application/xml', classification: 'supported' as const, reason: 'worksheet' },
        { partPath: 'customXml/item1.xml', contentType: 'application/xml', classification: 'preserved-not-modeled' as const, reason: 'custom xml' }
      ],
      relationships: [],
      unsupportedPartCount: 0
    };

    const manifest = computePreservationManifest(report);
    expect(manifest.totalParts).toBe(2);
    expect(manifest.preservedPartCount).toBe(2);
    expect(manifest.unmodeledOpaqueCount).toBe(1);
  });

  it('detects dropped opaque parts and throws NoSilentLossError', () => {
    const beforeManifest = {
      manifestId: 'pm_1',
      createdAt: new Date().toISOString(),
      totalParts: 1,
      preservedPartCount: 1,
      unmodeledOpaqueCount: 1,
      parts: [
        { partPath: 'customXml/item1.xml', contentType: 'application/xml', preservationAction: 'opaque-retained' as const, originalHash: 'hash1' as any }
      ]
    };

    const afterManifest = {
      manifestId: 'pm_2',
      createdAt: new Date().toISOString(),
      totalParts: 0,
      preservedPartCount: 0,
      unmodeledOpaqueCount: 0,
      parts: []
    };

    expect(() => assertNoSilentLoss(beforeManifest, afterManifest)).toThrow(NoSilentLossError);
  });
});
