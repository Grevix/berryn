# @berryn/xlsx-diff

> **ZIP archive entry byte comparison and normalized XML semantic string diffing engine.**

[![npm version](https://img.shields.io/npm/v/@berryn/xlsx-diff.svg)](https://www.npmjs.com/package/@berryn/xlsx-diff)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/xlsx-diff` compares spreadsheet binaries at two distinct abstraction layers:
1. **Package Level**: Evaluates ZIP archive inventory, added/removed parts, and entry byte hashes.
2. **Semantic XML Level**: Parses and normalizes internal XML structures (ignoring non-semantic whitespace, attribute ordering, and XML declaration quirks) to determine whether two workbooks are functionally equivalent.

This separation prevents false positives caused by differing ZIP compression levels or arbitrary XML attribute sequences while catching genuine data regressions.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/xlsx-diff

# Using npm
npm install @berryn/xlsx-diff
```

---

## Key Features

- **Binary vs Semantic Separation**: Differentiates between physical compression artifacts and true semantic mutations.
- **Normalized XML Comparison (`areXmlStringsEquivalent`)**: Canonically parses XML nodes and sorts attributes using `fast-xml-parser` to verify data equivalence.
- **High-Level Workbook Diff (`diffXlsxWorkbooks`)**: Compares two full XLSX byte buffers and returns added, removed, and modified part inventories.
- **Diagnostic Integration**: Emits structured `BRN-XLSX-005` info diagnostics summarizing changes.

---

## Usage Examples

### 1. Diffing Two XLSX Workbooks

```typescript
import { readFileSync } from 'node:fs';
import { diffXlsxWorkbooks } from '@berryn/xlsx-diff';

const beforeBuffer = readFileSync('before.xlsx');
const afterBuffer = readFileSync('after.xlsx');

const { value: diffResult, diagnostics } = diffXlsxWorkbooks(beforeBuffer, afterBuffer);

console.log(diffResult.semanticSummary);
// "Differences detected: 0 added, 0 removed, 1 modified parts."

console.log('Modified Parts:', diffResult.packageDiff.modifiedParts);
```

---

### 2. Semantic XML Equivalence Testing

```typescript
import { areXmlStringsEquivalent, normalizeXmlString } from '@berryn/xlsx-diff';

const xmlA = `<sheetData><row r="1"><c r="A1" t="s"><v>0</v></c></row></sheetData>`;
const xmlB = `
<sheetData>
  <row r="1">
    <c t="s" r="A1">
      <v>0</v>
    </c>
  </row>
</sheetData>
`;

const isEquivalent = areXmlStringsEquivalent(xmlA, xmlB);
console.log(`Equivalent: ${isEquivalent}`); // true
```

---

### 3. Comparing Package Archives

```typescript
import { diffPackageArchives } from '@berryn/xlsx-diff';
import { inspectXlsx } from '@berryn/xlsx-inspect';

const { value: beforeReport } = inspectXlsx(beforeBuffer);
const { value: afterReport } = inspectXlsx(afterBuffer);

const pkgDiff = diffPackageArchives(beforeReport, afterReport);

if (pkgDiff.hasDifferences) {
  console.log(`Added: ${pkgDiff.addedParts.join(', ')}`);
  console.log(`Removed: ${pkgDiff.removedParts.join(', ')}`);
}
```

---

## Exported Symbols

| Symbol | Category | Description |
|---|---|---|
| `diffXlsxWorkbooks` | Function | Compares two XLSX binary buffers across package and semantic XML layers. |
| `diffPackageArchives` | Function | Compares two `XlsxInspectionReport` instances for part additions/deletions. |
| `areXmlStringsEquivalent` | Function | Checks semantic equivalence between two raw XML strings. |
| `normalizeXmlString` | Function | Parses and canonicalizes XML into a sorted JSON string representation. |
| `FullDiffResult` | Interface | Aggregated diff result with package diff metrics and semantic summary. |
| `PackageDiffResult` | Interface | Inventory of added, removed, modified, and identical OOXML parts. |
| `EntryDiffItem` | Interface | Per-entry diff descriptor with path and modification kind. |

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
