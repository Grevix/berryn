import type { ResourceLimits } from '@berryn/core';
export interface ResourceUsageStats {
    inputBytes?: number;
    entryCount?: number;
    entryUncompressedBytes?: number;
    totalUncompressedBytes?: number;
    xmlCharacters?: number;
    xmlDepth?: number;
    relationships?: number;
    diagnosticsCount?: number;
    runMilliseconds?: number;
}
export declare function assertResourceLimits(usage: ResourceUsageStats, limits: ResourceLimits): void;
//# sourceMappingURL=limits.d.ts.map