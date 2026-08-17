import { readFileSync } from 'node:fs';
import { renderReportMarkdown } from '@berryn/migration-report';
import { EXIT_CODES } from '../exit-codes.js';

export function handleReportCommand(reportPath: string): void {
  try {
    const raw = readFileSync(reportPath, 'utf-8');
    const parsed = JSON.parse(raw);

    if (parsed.schemaVersion) {
      console.log(renderReportMarkdown(parsed));
    } else {
      console.log(raw);
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (err: any) {
    console.error(`[REPORT ERROR]: Failed to read or render report file: ${err.message}`);
    process.exit(EXIT_CODES.ERR_CONFIG);
  }
}
