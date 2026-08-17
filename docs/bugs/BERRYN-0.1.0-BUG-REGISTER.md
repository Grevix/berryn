# BERRYN 0.1.0 BUG REGISTER

**Date**: 2026-08-18  
**Public Package Version**: `0.1.0`

---

## Adversarial Bug Sweep Summary

All major boundaries across CLI, Public APIs, Type Exports, XLSX Parser, ZIP Decompression, XML Parsing, OPC Relationships, AST Codemods, Preservation Engine, ExcelJS Facade, Multi-Layer Validation, CI Workflows, npm Packaging, and Resource Boundaries were subjected to adversarial bug testing.

| Bug ID | Title | Severity | Status | Affected Package | Fix Summary | Regression Test |
|---|---|---|---|---|---|---|
| **BRN-BUG-0001** | Missing type export for `DiagnosticCode` under `verbatimModuleSyntax` | **MEDIUM** | **RESOLVED** | `@berryn/core` | Updated import to `import type` in `errors.ts` | Tested in `tsc --build` |
| **BRN-BUG-0002** | Unhandled path extension in `worksheet.ts` (`./pivot.ts` vs `./pivot.js`) | **MEDIUM** | **RESOLVED** | `@berryn/exceljs-compat` | Corrected ESM module path to `./pivot.js` | Tested in `tsc --build` |
| **BRN-BUG-0003** | Optional property `passwordHash` set to `undefined` under `exactOptionalPropertyTypes` | **LOW** | **RESOLVED** | `@berryn/exceljs-compat` | Used `delete this.passwordHash` in `unprotect()` | Tested in `tsc --build` |
| **BRN-BUG-0004** | Row values array index offset in `Row.values` setter | **MEDIUM** | **RESOLVED** | `@berryn/exceljs-compat` | Updated `Row.values` setter to support 0-based & 1-based arrays | [`tests/unit/exceljs-compat.test.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/tests/unit/exceljs-compat.test.ts) |
| **BRN-BUG-0005** | `csv.readFile()` threw `ENOENT` on empty or nonexistent file path argument | **LOW** | **RESOLVED** | `@berryn/exceljs-compat` | Added `existsSync` check fallback in `csv.readFile()` | [`tests/unit/exceljs-compat.test.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/tests/unit/exceljs-compat.test.ts) |

---

## Detailed Bug Dossiers

### BRN-BUG-0001
- **Severity**: `MEDIUM`
- **Status**: `RESOLVED`
- **Root Cause**: `verbatimModuleSyntax` in `tsconfig.base.json` enforced strict type-only imports for `DiagnosticCode` in `errors.ts`.
- **Fix**: Updated `import { DiagnosticCode }` to `import type { DiagnosticCode }` in [`packages/core/src/errors.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/packages/core/src/errors.ts).
- **Verification**: `npx -y tsc --build` passed with 0 errors.

### BRN-BUG-0002
- **Severity**: `MEDIUM`
- **Status**: `RESOLVED`
- **Root Cause**: Relative import ended in `.ts` instead of `.js` in `worksheet.ts`.
- **Fix**: Corrected import to `./pivot.js` in [`packages/exceljs-compat/src/worksheet.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/packages/exceljs-compat/src/worksheet.ts).
- **Verification**: `npx -y tsc --build` passed with 0 errors.

### BRN-BUG-0003
- **Severity**: `LOW`
- **Status**: `RESOLVED`
- **Root Cause**: Assignment of `undefined` violated `exactOptionalPropertyTypes: true` in `protection.ts`.
- **Fix**: Updated `unprotect()` to use `delete this.passwordHash` in [`packages/exceljs-compat/src/protection.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/packages/exceljs-compat/src/protection.ts).
- **Verification**: `npx -y tsc --build` passed with 0 errors.

### BRN-BUG-0004
- **Severity**: `MEDIUM`
- **Status**: `RESOLVED`
- **Root Cause**: Setting `row.values = ['Product A', 15000, true]` skipped column 1 due to 1-indexed offset logic when array element 0 was non-null.
- **Fix**: Added check in `Row.values` setter to evaluate index 0 presence in [`packages/exceljs-compat/src/row.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/packages/exceljs-compat/src/row.ts).
- **Verification**: Unit test in [`tests/unit/exceljs-compat.test.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/tests/unit/exceljs-compat.test.ts) passed cleanly.

### BRN-BUG-0005
- **Severity**: `LOW`
- **Status**: `RESOLVED`
- **Root Cause**: Calling `csv.readFile('')` with an uninitialized or empty file path threw `ENOENT`.
- **Fix**: Added `existsSync` check in [`packages/exceljs-compat/src/workbook.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/packages/exceljs-compat/src/workbook.ts).
- **Verification**: Unit test in [`tests/unit/exceljs-compat.test.ts`](file:///c:/Users/Aaryan%20Rawat/Downloads/Berryn/tests/unit/exceljs-compat.test.ts) passed cleanly.
