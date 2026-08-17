import { randomUUID } from 'node:crypto';
import type { RunMetadata } from './envelope.js';
import { hashString } from './hash.js';
import type { BerrynPolicy } from './policy.js';
import { DEFAULT_BERRYN_POLICY } from './policy.js';
import { makeRunId } from './types.js';

export interface RunContextOptions {
  cwd?: string;
  policy?: BerrynPolicy;
  toolVersion?: string;
}

export interface RunContext {
  runMetadata: RunMetadata;
  policy: BerrynPolicy;
}

export function createRunContext(options: RunContextOptions = {}): RunContext {
  const cwd = options.cwd ?? process.cwd();
  const policy = options.policy ?? {
    ...DEFAULT_BERRYN_POLICY,
    allowedRoots: [cwd]
  };
  const policyHash = hashString(JSON.stringify(policy));

  const runMetadata: RunMetadata = {
    runId: makeRunId(`run_${randomUUID().replace(/-/g, '')}`),
    toolVersion: options.toolVersion ?? '0.1.1',
    startedAt: new Date().toISOString(),
    cwd,
    runtime: {
      name: 'node',
      version: process.version
    },
    network: 'disabled',
    policyHash
  };

  return {
    runMetadata,
    policy: {
      ...policy,
      policyHash
    }
  };
}
