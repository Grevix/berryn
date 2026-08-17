# @berryn/migration-report

> **`BERRYN_REPORT_V1` machine-readable JSON schema validator and Markdown executive report renderer.**

[![npm version](https://img.shields.io/npm/v/@berryn/migration-report.svg)](https://www.npmjs.com/package/@berryn/migration-report)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/migration-report` standardizes and renders evidence artifacts across all Berryn inspection, diffing, validation, and codemod workflows.

It defines the formal `BERRYN_REPORT_V1` schema, calculates overall deployability gates (`ready`, `warnings-review-required`, `blocked`), and provides renderers for:
1. **Machine-Readable JSON**: For CI pipelines, SAST tools, and automated regression tracking.
2. **Executive Markdown Summaries**: For Pull Request comments, compliance audit packets, and release notes.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/migration-report

# Using npm
npm install @berryn/migration-report
```

---

## The `BERRYN_REPORT_V1` Schema

```typescript
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
```

### Deployability Assessment Logic

- **`ready`**: Zero critical security findings, zero errors, and clean execution status.
- **`warnings-review-required`**: Non-critical warnings present (e.g. unmodeled opaque parts preserved, consumer repair notices); requires reviewer sign-off.
- **`blocked`**: Any critical finding, structural corruption, failed validation stage, or rejected mutation.

---

## Usage Examples

### 1. Building a Migration Report from a Result Envelope

```typescript
import { createSuccessEnvelope, createRunContext } from '@berryn/core';
import { buildMigrationReport, renderReportMarkdown, renderReportJson } from '@berryn/migration-report';

const context = createRunContext();
const envelope = createSuccessEnvelope({ migratedFiles: 12 }, context.runMetadata);

// Build structured report
const report = buildMigrationReport(envelope, 'migration');

console.log(`Deployability: ${report.summary.deployability}`); // 'ready'
```

---

### 2. Rendering Markdown for GitHub PR Comments

```typescript
import { renderReportMarkdown } from '@berryn/migration-report';

const markdown = renderReportMarkdown(report);
console.log(markdown);

// Output:
// # Berryn Migration & Evidence Report (MIGRATION)
// **Schema Version**: 0.1.0
// **Generated At**: 2026-08-18T00:00:00.000Z
// **Deployability Status**: PASSED (Deployment Ready)
//
// ## Executive Summary
// - **Total Observations**: 0
// - **Critical Security Findings**: 0
// - **Errors**: 0
// - **Warnings**: 0
```

---

### 3. Rendering Formatted JSON for CI Artifacts

```typescript
import { renderReportJson } from '@berryn/migration-report';

const jsonString = renderReportJson(report);
// Save to disk for CI pipeline consumption
// fs.writeFileSync('berryn-evidence-report.json', jsonString);
```

---

## Exported Symbols

| Symbol | Type | Description |
|---|---|---|
| `buildMigrationReport` | Function | Transforms any `ResultEnvelope<T>` into a typed `BERRYN_REPORT_V1` structure. |
| `renderReportMarkdown` | Function | Renders an executive Markdown summary with breakdown tables and formatted diagnostics. |
| `renderReportJson` | Function | Formats a report into an indented JSON string. |
| `BERRYN_REPORT_V1` | Interface | Canonical schema definition for Berryn evidence reports. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
