# @berryn/diagnostics

> **Diagnostic catalog (`BRN-*` error codes), remediation advice renderers, and diagnostic formatters.**

[![npm version](https://img.shields.io/npm/v/@berryn/diagnostics.svg)](https://www.npmjs.com/package/@berryn/diagnostics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/diagnostics` provides the structured catalog of error and warning codes (`BRN-*`), confidence scorers, location mappers, remediation advice generators, and terminal/text formatters for the Berryn toolchain.

Rather than throwing generic exceptions, Berryn emits actionable diagnostics with unambiguous error codes, explicit confidence ratings, and exact step-by-step remediation advice to guide developers through complex migrations.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/diagnostics

# Using npm
npm install @berryn/diagnostics
```

---

## Diagnostic Code Catalog (`BRN-*`)

| Category | Diagnostic Code | Description | Default Severity |
|---|---|---|---|
| **Security** | `BRN-SEC-001` | Path traversal violation outside sandbox boundary | `critical` |
| | `BRN-SEC-002` | ZIP bomb / decompression ratio anomaly detected | `critical` |
| | `BRN-SEC-003` | Prohibited XXE payload or DTD entity declaration | `critical` |
| | `BRN-SEC-004` | Resource limits (memory, file size) exceeded | `critical` |
| | `BRN-SEC-005` | Unsafe subprocess invocation detected | `critical` |
| **Project Inspection** | `BRN-PROJ-001` | Project manifest (`package.json`) not found | `error` |
| | `BRN-PROJ-002` | Deprecated incumbent dependency detected | `info` |
| | `BRN-PROJ-003` | Dynamic AST call requires manual inspection | `warning` |
| **XLSX Inspection & Diff** | `BRN-XLSX-001` | Malformed or corrupted ZIP container | `critical` |
| | `BRN-XLSX-002` | Broken or missing OPC relationship target | `error` |
| | `BRN-XLSX-003` | Unsupported or unmodeled OOXML part | `warning` |
| | `BRN-XLSX-004` | Workbook mutation rejected by safety policy | `error` |
| | `BRN-XLSX-005` | Semantic mismatch detected between parts | `info` |
| **Validation** | `BRN-VAL-001` | Structural validation stage failed | `critical` |
| | `BRN-VAL-002` | OPC relationship graph validation failed | `error` |
| | `BRN-VAL-003` | Consumer repair warning or non-critical anomaly | `warning` |
| **Compatibility** | `BRN-COMPAT-001` | Unsupported or unmapped legacy API invocation | `error` |
| **Codemod** | `BRN-CODE-001` | AST transformation step failed | `error` |
| | `BRN-CODE-002` | Ambiguous AST pattern requires manual migration | `warning` |

---

## Usage Examples

### 1. Creating a Structured Diagnostic

```typescript
import { createDiagnostic, DIAGNOSTIC_CODES } from '@berryn/diagnostics';

const diagnostic = createDiagnostic({
  code: DIAGNOSTIC_CODES.SEC_ZIP_BOMB,
  severity: 'critical',
  message: 'ZIP bomb detected: Decompressed size exceeds 100:1 ratio limit.',
  confidence: 'high',
  location: {
    file: 'workbook.xlsx',
    part: 'xl/worksheets/sheet1.xml'
  },
  remediation: 'Inspect worksheet compression parameters and verify payload source.',
  evidenceRef: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
});
```

---

### 2. Formatting Diagnostics for Terminal Output

```typescript
import { formatDiagnosticText, formatDiagnosticsSummary } from '@berryn/diagnostics';

// Format a single diagnostic
console.log(formatDiagnosticText(diagnostic));
// Output:
// [BRN-SEC-002] CRITICAL [workbook.xlsx]: ZIP bomb detected: Decompressed size exceeds 100:1 ratio limit.
//   Remediation: Inspect worksheet compression parameters and verify payload source.
//   Evidence: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

// Format an entire collection summary
const summary = formatDiagnosticsSummary([diagnostic]);
console.log(summary);
```

---

## Exported Symbols

- `DIAGNOSTIC_CODES`: Immutable dictionary of all standardized `BRN-*` code strings.
- `createDiagnostic(options)`: Factory for generating strictly-typed `Diagnostic` objects.
- `formatDiagnosticText(diagnostic)`: Renders a single diagnostic with line numbers and remediation.
- `formatDiagnosticsSummary(diagnostics)`: Produces an aggregated text summary with breakdown counts.

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
