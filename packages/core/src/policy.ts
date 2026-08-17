import type { ContentHash, Severity } from './types.js';

export interface ResourceLimits {
  maxInputBytes: number;
  maxEntryCount: number;
  maxEntryUncompressedBytes: number;
  maxTotalUncompressedBytes: number;
  maxXmlCharacters: number;
  maxXmlDepth: number;
  maxRelationships: number;
  maxDiagnostics: number;
  maxRunMilliseconds: number;
  maxTempBytes: number;
}

export const DEFAULT_RESOURCE_LIMITS: ResourceLimits = {
  maxInputBytes: 512 * 1024 * 1024, // 512 MB
  maxEntryCount: 100_000,
  maxEntryUncompressedBytes: 512 * 1024 * 1024, // 512 MB
  maxTotalUncompressedBytes: 2 * 1024 * 1024 * 1024, // 2 GB
  maxXmlCharacters: 250_000_000,
  maxXmlDepth: 256,
  maxRelationships: 1_000_000,
  maxDiagnostics: 10_000,
  maxRunMilliseconds: 10 * 60 * 1000, // 10 min
  maxTempBytes: 4 * 1024 * 1024 * 1024 // 4 GB
};

export interface BerrynPolicy {
  schemaVersion: '0.1.0';
  mode: 'advisory' | 'strict' | 'migration';
  network: 'deny';
  unknownParts: 'report' | 'reject-mutation';
  failOn: Severity;
  limits: ResourceLimits;
  allowedRoots: string[];
  policyHash?: ContentHash;
}

export const DEFAULT_BERRYN_POLICY: BerrynPolicy = {
  schemaVersion: '0.1.0',
  mode: 'strict',
  network: 'deny',
  unknownParts: 'report',
  failOn: 'error',
  limits: DEFAULT_RESOURCE_LIMITS,
  allowedRoots: []
};
