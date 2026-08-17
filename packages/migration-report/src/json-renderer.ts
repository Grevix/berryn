import type { BERRYN_REPORT_V1 } from './schema.js';

export function renderReportJson(report: BERRYN_REPORT_V1, pretty = true): string {
  return JSON.stringify(report, null, pretty ? 2 : undefined);
}
