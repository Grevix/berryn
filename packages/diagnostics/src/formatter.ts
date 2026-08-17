import type { Diagnostic } from '@berryn/core';

export function formatDiagnosticText(diagnostic: Diagnostic): string {
  const levelStr = diagnostic.severity.toUpperCase().padEnd(8);
  const locationStr = diagnostic.location?.file
    ? ` [${diagnostic.location.file}${diagnostic.location.line ? `:${diagnostic.location.line}` : ''}]`
    : '';

  let output = `[${diagnostic.code}] ${levelStr}${locationStr}: ${diagnostic.message}`;

  if (diagnostic.remediation) {
    output += `\n  Remediation: ${diagnostic.remediation}`;
  }

  if (diagnostic.evidenceRef) {
    output += `\n  Evidence: ${diagnostic.evidenceRef}`;
  }

  return output;
}

export function formatDiagnosticsSummary(diagnostics: Diagnostic[]): string {
  if (diagnostics.length === 0) {
    return 'Zero diagnostics reported. Execution clean.';
  }

  const counts = {
    critical: 0,
    error: 0,
    warning: 0,
    info: 0
  };

  for (const d of diagnostics) {
    counts[d.severity]++;
  }

  const header = `Diagnostics Summary: ${diagnostics.length} total (${counts.critical} critical, ${counts.error} errors, ${counts.warning} warnings, ${counts.info} info)`;
  const lines = diagnostics.map((d) => formatDiagnosticText(d));

  return `${header}\n${'-'.repeat(60)}\n${lines.join('\n\n')}`;
}
