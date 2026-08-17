import type { ContentHash, Diagnostic, EnvelopeStatus, RunId } from './types.js';

export interface RuntimeMetadata {
  name: string;
  version: string;
}

export interface RunMetadata {
  runId: RunId;
  toolVersion: string;
  startedAt: string;
  completedAt?: string;
  cwd: string;
  runtime: RuntimeMetadata;
  network: 'disabled';
  policyHash: ContentHash;
}

export interface ResultEnvelope<T> {
  schemaVersion: '0.1.0';
  run: RunMetadata;
  value: T;
  diagnostics: Diagnostic[];
  status: EnvelopeStatus;
}

export function computeEnvelopeStatus(diagnostics: Diagnostic[]): EnvelopeStatus {
  const hasCriticalOrError = diagnostics.some(
    (d) => d.severity === 'critical' || d.severity === 'error'
  );
  if (hasCriticalOrError) {
    return 'failed';
  }

  const hasWarning = diagnostics.some((d) => d.severity === 'warning');
  if (hasWarning) {
    return 'passed-with-warnings';
  }

  return 'passed';
}

export function createResultEnvelope<T>(
  value: T,
  run: RunMetadata,
  diagnostics: Diagnostic[] = []
): ResultEnvelope<T> {
  return {
    schemaVersion: '0.1.0',
    run: {
      ...run,
      completedAt: run.completedAt ?? new Date().toISOString()
    },
    value,
    diagnostics,
    status: computeEnvelopeStatus(diagnostics)
  };
}
