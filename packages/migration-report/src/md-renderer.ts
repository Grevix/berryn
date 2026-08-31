import { formatDiagnosticText } from '@berryn/diagnostics';
import type { BERRYN_REPORT_V1 } from './schema.js';

export function renderReportMarkdown(report: BERRYN_REPORT_V1): string {
  const statusEmoji =
    report.summary.deployability === 'ready'
      ? 'PASSED (Deployment Ready)'
      : report.summary.deployability === 'warnings-review-required'
      ? 'WARNINGS (Review Required)'
      : 'BLOCKED (Migration Errors Detected)';

  let md = `# Berryn Migration & Evidence Report (${report.reportType.toUpperCase()})\n`;
  md += `**Schema Version**: ${report.schemaVersion}  \n`;
  md += `**Generated At**: ${report.generatedAt}  \n`;
  md += `**Deployability Status**: ${statusEmoji}\n\n`;

  md += `## Executive Summary\n`;
  md += `- **Total Observations**: ${report.summary.totalDiagnostics}\n`;
  md += `- **Critical Security Findings**: ${report.summary.criticalCount}\n`;
  md += `- **Errors**: ${report.summary.errorCount}\n`;
  md += `- **Warnings**: ${report.summary.warningCount}\n\n`;

  if (report.diagnostics.length > 0) {
    md += `## Detailed Diagnostics\n\`\`\`text\n`;
    md += report.diagnostics.map((d) => formatDiagnosticText(d)).join('\n\n');
    md += `\n\`\`\`\n`;
  } else {
    md += `## Detailed Diagnostics\nZero diagnostics or warnings reported. Execution clean.\n`;
  }

  return md;
}

export function renderReportPrComment(report: BERRYN_REPORT_V1): string {
  const badge =
    report.summary.deployability === 'ready'
      ? '🟢 **PASSED**'
      : report.summary.deployability === 'warnings-review-required'
      ? '🟡 **WARNINGS**'
      : '🔴 **BLOCKED**';

  let comment = `### 🍇 Berryn CI Migration Evidence Report ${badge}\n\n`;
  comment += `| Metric | Count |\n`;
  comment += `| --- | --- |\n`;
  comment += `| Deployability | ${report.summary.deployability} |\n`;
  comment += `| Diagnostics | ${report.summary.totalDiagnostics} |\n`;
  comment += `| Security Findings | ${report.summary.criticalCount} |\n`;
  comment += `| Errors | ${report.summary.errorCount} |\n`;
  comment += `| Warnings | ${report.summary.warningCount} |\n\n`;

  if (report.diagnostics.length > 0) {
    comment += `<details><summary>View Diagnostics (${report.diagnostics.length})</summary>\n\n\`\`\`text\n`;
    comment += report.diagnostics.map((d) => formatDiagnosticText(d)).join('\n');
    comment += `\n\`\`\`\n</details>\n`;
  }

  return comment;
}
