# @berryn/exceljs-compat

> **Narrow compatibility facade for ExcelJS (`Workbook`, `Worksheet`, `Cell`) with explicit error boundaries.**

[![npm version](https://img.shields.io/npm/v/@berryn/exceljs-compat.svg)](https://www.npmjs.com/package/@berryn/exceljs-compat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%2B-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@berryn/exceljs-compat` provides a high-fidelity, drop-in replacement facade for core `exceljs` workflows. It models standard workbook manipulation (`Workbook`, `Worksheet`, `Row`, `Column`, `Cell`, cell styling, formulas, merged cells, data validations, page setup, and tables).

### The "No Silent Corruption" Contract

Unlike conventional mock libraries or loosely compatible wrappers that silently ignore unhandled methods or corrupt formatting:
- Supported ExcelJS APIs function with byte/semantic accuracy.
- Unsupported methods fail **loudly and immediately** with a typed `BerrynCompatibilityError` and actionable remediation advice (`BRN-COMPAT-001`).
- Preserved OOXML parts (charts, drawings, macros) are retained without corruption.

---

## Installation

```bash
# Using pnpm
pnpm add @berryn/exceljs-compat

# Using npm
npm install @berryn/exceljs-compat
```

---

## Migration Quickstart

Simply point your existing `exceljs` imports to `@berryn/exceljs-compat`:

```diff
- import ExcelJS from 'exceljs';
+ import ExcelJS from '@berryn/exceljs-compat';
```

Or use named imports:

```typescript
import { Workbook } from '@berryn/exceljs-compat';

const workbook = new Workbook();
const worksheet = workbook.addWorksheet('Q3 Financials');

// Cell access and values
worksheet.getCell('A1').value = 'Revenue';
worksheet.getCell('B1').value = 150000;
worksheet.getCell('B1').numFmt = '$#,##0.00';

// Formulas
worksheet.getCell('C1').value = { formula: 'B1*1.15', result: 172500 };

// Styling
worksheet.getCell('A1').font = { bold: true, color: { argb: 'FF0000FF' } };
worksheet.getCell('A1').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFEFEFEF' }
};

// Row and column manipulation
worksheet.getColumn(1).width = 20;
worksheet.getRow(1).height = 25;

// Merged cells
worksheet.mergeCells('D1:F1');

// Save workbook
await workbook.xlsx.writeFile('financials.xlsx');
```

---

## Supported APIs & Capabilities

| Class | Supported Methods / Properties | Status |
|---|---|---|
| `Workbook` | `addWorksheet`, `getWorksheet`, `worksheets`, `creator`, `created`, `views`, `xlsx.readFile`, `xlsx.writeFile`, `xlsx.load`, `xlsx.writeBuffer` | **Fully Supported** |
| `Worksheet` | `getCell`, `getRow`, `getColumn`, `mergeCells`, `unMergeCells`, `addTable`, `addPivotTable`, `protect`, `pageSetup`, `autoFilter`, `views` | **Fully Supported** |
| `Cell` | `value`, `text`, `type`, `font`, `fill`, `border`, `alignment`, `numFmt`, `dataValidation` | **Fully Supported** |
| `Row` | `values`, `height`, `hidden`, `font`, `alignment`, `getCell`, `commit` | **Fully Supported** |
| `Column` | `width`, `hidden`, `values`, `font`, `alignment`, `numFmt`, `key` | **Fully Supported** |
| `Table` | `name`, `ref`, `headerRow`, `totalsRow`, `style`, `columns` | **Supported** |
| `Protection` | `protect(password, options)`, `unprotect()` | **Supported** |

---

## Explicit Error Boundary Example

When unmodeled or deprecated methods are invoked, an explicit `BerrynCompatibilityError` is thrown:

```typescript
import { Workbook } from '@berryn/exceljs-compat';
import { BerrynCompatibilityError } from '@berryn/core';

const wb = new Workbook();
const ws = wb.addWorksheet('Sheet1');

try {
  // If an unsupported legacy internal method is called
  (ws as any).unsupportedLegacyMethod();
} catch (err) {
  if (err instanceof BerrynCompatibilityError) {
    console.error(err.diagnostic.code); // BRN-COMPAT-001
    console.error(err.diagnostic.remediation);
  }
}
```

---

## Exported Symbols

- `Workbook`: Main container class managing sheets, calculation properties, and serialization.
- `Worksheet`: Sheet grid controller managing cell values, merging, rows, columns, and tables.
- `Cell`: Individual cell data holder managing values, types, rich text, and styles.
- `Row` & `Column`: Dimension and formatting controllers.
- `WorksheetProtection`: Password hashing and permission flags.
- `Table` & `PivotTable`: Structured table and pivot definition models.

---

## Links

- **Repository**: [https://github.com/Grevix/berryn](https://github.com/Grevix/berryn)
- **License**: [MIT](https://opensource.org/licenses/MIT) © 2026 Berryn Core Engineering Team
