# BERRYN RELEASE AUDIT: 15 - XLSX COMPATIBILITY AUDIT

- **Narrow ExcelJS Facade**: `@berryn/exceljs-compat` provides `Workbook`, `Worksheet`, `Cell`.
- **Loud Failure Mechanics**: Unsupported operations throw `BerrynCompatibilityError`.
- **Classification**: 5 tiers (`supported`, `partially-supported`, `preserved-not-modeled`, `unsupported`, `rejected`).
