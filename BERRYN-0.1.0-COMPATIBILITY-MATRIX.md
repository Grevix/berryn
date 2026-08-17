# BERRYN EXCELJS COMPATIBILITY MATRIX

**Package**: `@berryn/exceljs-compat`  
**Public Package Version**: `0.1.0`

---

## 1. Supported API Surface

| Source API | ExcelJS Equivalent | Support Classification | Fail-Safe Behavior |
|---|---|---|---|
| `new ExcelJS.Workbook()` | `new Workbook()` | **Supported** | Constructs workbook |
| `wb.addWorksheet(name)` | `wb.addWorksheet(name)` | **Supported** | Adds worksheet instance |
| `wb.xlsx.readFile(file)` | `wb.xlsx.readFile(file)` | **Supported** | Parses via `@berryn/xlsx-inspect` |
| `wb.xlsx.writeFile(file)` | `wb.xlsx.writeFile(file)` | **Supported** | Writes minimal ZIP buffer |
| `ws.addRow(values)` | `ws.addRow(values)` | **Supported** | Populates internal cell map |
| `ws.getCell(address)` | `ws.getCell(address)` | **Supported** | Returns `Cell` instance |
| `ws.protect()` | `ws.protect()` | **Unsupported** | Throws `BerrynCompatibilityError` |
| `wb.addPivotTable()` | `wb.addPivotTable()` | **Unsupported** | Throws `BerrynCompatibilityError` |
