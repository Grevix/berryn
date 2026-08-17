# BERRYN EXCELJS COMPATIBILITY MATRIX

**Package**: `@berryn/exceljs-compat`  
**Public Version**: `0.1.0`

---

## 1. Supported API Surface

| Source API | ExcelJS Equivalent | Berryn Support Status | Exclusion / Loud Failure Behavior |
|---|---|---|---|
| `new ExcelJS.Workbook()` | `new Workbook()` | **Supported** | None |
| `wb.addWorksheet(name)` | `wb.addWorksheet(name)` | **Supported** | None |
| `wb.xlsx.readFile(file)` | `wb.xlsx.readFile(file)` | **Supported** | Uses `@berryn/xlsx-inspect` |
| `wb.xlsx.writeFile(file)` | `wb.xlsx.writeFile(file)` | **Supported** | Minimal write output |
| `ws.addRow(values)` | `ws.addRow(values)` | **Supported** | Populates internal cell map |
| `ws.getCell(address)` | `ws.getCell(address)` | **Supported** | Returns `Cell` instance |
| `ws.protect()` | `ws.protect()` | **Unsupported** | Throws `BerrynCompatibilityError` |
| `wb.addPivotTable()` | `wb.addPivotTable()` | **Unsupported** | Throws `BerrynCompatibilityError` |
