import { describe, expect, it } from 'vitest';
import { createResultEnvelope, createRunContext } from '../../packages/core/src/index.js';
import {
  buildMigrationReport,
  renderReportJson,
  renderReportMarkdown
} from '../../packages/migration-report/src/index.js';

describe('@berryn/migration-report', () => {
  it('builds BERRYN_REPORT_V1 schema with deployability assessment', () => {
    const context = createRunContext();
    const envelope = createResultEnvelope({ inspected: true }, context.runMetadata, []);
    const report = buildMigrationReport(envelope, 'inspection');

    expect(report.schemaVersion).toBe('0.1.0');
    expect(report.reportType).toBe('inspection');
    expect(report.summary.deployability).toBe('ready');
  });

  it('renders report cleanly as JSON and Markdown', () => {
    const context = createRunContext();
    const envelope = createResultEnvelope({ inspected: true }, context.runMetadata, []);
    const report = buildMigrationReport(envelope, 'inspection');

    const jsonText = renderReportJson(report);
    const mdText = renderReportMarkdown(report);

    expect(jsonText).toContain('"schemaVersion": "0.1.0"');
    expect(mdText).toContain('# Berryn Migration & Evidence Report');
  });
});
