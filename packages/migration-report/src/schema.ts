import type { Diagnostic, ResultEnvelope } from '@berryn/core';

export interface BERRYN_REPORT_V1 {
  schemaVersion: '0.1.0';
  reportType: 'inspection' | 'diff' | 'validation' | 'migration';
  generatedAt: string;
  summary: {
    totalDiagnostics: number;
    criticalCount: number;
    errorCount: number;
    warningCount: number;
    deployability: 'ready' | 'warnings-review-required' | 'blocked';
  };
  details: unknown;
  diagnostics: Diagnostic[];
}

export function buildMigrationReport<T>(
  envelope: ResultEnvelope<T>,
  type: BERRYN_REPORT_V1['reportType']
): BERRYN_REPORT_V1 {
  const criticals = envelope.diagnostics.filter((d) => d.severity === 'critical').length;
  const errors = envelope.diagnostics.filter((d) => d.severity === 'error').length;
  const warnings = envelope.diagnostics.filter((d) => d.severity === 'warning').length;

  let deployability: BERRYN_REPORT_V1['summary']['deployability'] = 'ready';
  if (criticals > 0 || errors > 0 || envelope.status === 'failed' || envelope.status === 'rejected') {
    deployability = 'blocked';
  } else if (warnings > 0 || envelope.status === 'passed-with-warnings') {
    deployability = 'warnings-review-required';
  }

  return {
    schemaVersion: '0.1.0',
    reportType: type,
    generatedAt: new Date().toISOString(),
    summary: {
      totalDiagnostics: envelope.diagnostics.length,
      criticalCount: criticals,
      errorCount: errors,
      warningCount: warnings,
      deployability
    },
    details: envelope.value,
    diagnostics: envelope.diagnostics
  };
}
