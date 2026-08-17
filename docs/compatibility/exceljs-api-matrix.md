# BERRYN EXCELJS COMPATIBILITY SURFACE MATRIX

**Target Version**: `ExcelJS 4.4.0`  
**Status**: **100% DECLARED API SURFACE SUPPORTED & VERIFIED**

| Category | API | Status | Tested | Preservation Strategy |
|---|---|---|---|---|
| **Workbook** | `new Workbook()` | **Supported** | Yes | Structural OPC container construction |
| **Workbook** | `workbook.creator / lastModifiedBy / created / modified` | **Supported** | Yes | Core properties metadata serialization |
| **Workbook** | `workbook.calcProperties / views / properties` | **Supported** | Yes | Workbook view & calculation properties |
| **Workbook** | `workbook.addWorksheet(name)` | **Supported** | Yes | Sheet relationship & XML graph insertion |
| **Workbook** | `workbook.getWorksheet(idOrName)` | **Supported** | Yes | Workspace sheet retrieval by ID or name |
| **Workbook** | `workbook.removeWorksheet(idOrName)` | **Supported** | Yes | Workspace sheet deletion and relationship updates |
| **Workbook** | `workbook.addDefinedName(name, range)` | **Supported** | Yes | Defined names & range mapping |
| **Workbook** | `workbook.addImage(options)` | **Supported** | Yes | Media part registry & relationship linking |
| **Workbook** | `workbook.xlsx.readFile / writeFile / load / writeBuffer` | **Supported** | Yes | Bounded XLSX ZIP package read/write |
| **Workbook** | `workbook.csv.readFile / writeFile / writeBuffer` | **Supported** | Yes | Streaming CSV parsing & formatting |
| **Worksheet** | `worksheet.name / id / state` | **Supported** | Yes | Sheet state ('visible', 'hidden', 'veryHidden') |
| **Worksheet** | `worksheet.getCell(address)` | **Supported** | Yes | Cell coordinate lookup & instantiations |
| **Worksheet** | `worksheet.getRow(rowNumber)` | **Supported** | Yes | Row model retrieval & value mapping |
| **Worksheet** | `worksheet.getColumn(colIndexOrKey)` | **Supported** | Yes | Column model retrieval & formatting |
| **Worksheet** | `worksheet.addRow / addRows / insertRow / spliceRows` | **Supported** | Yes | Dynamic row insertion & value population |
| **Worksheet** | `worksheet.eachRow / eachColumn` | **Supported** | Yes | Iterative row/column traversal |
| **Worksheet** | `worksheet.mergeCells / unMergeCells` | **Supported** | Yes | Cell range merging & unmerging |
| **Worksheet** | `worksheet.protect(password, options) / unprotect()` | **Supported** | Yes | SHA-512 sheet protection & option flags |
| **Worksheet** | `worksheet.addPivotTable(options)` | **Supported** | Yes | Pivot cache definition & OOXML pivot tables |
| **Worksheet** | `worksheet.addTable(options)` | **Supported** | Yes | Table definitions, totals row, and column styles |
| **Worksheet** | `worksheet.addImage(imageId, range)` | **Supported** | Yes | Image anchor positioning & drawings |
| **Worksheet** | `worksheet.pageSetup / views` | **Supported** | Yes | Orientation, margins, fitToPage, view splits |
| **Cell** | `cell.value` (Scalar, Date, Formula, Hyperlink, RichText, Error) | **Supported** | Yes | Full cell value variant support |
| **Cell** | `cell.font` (name, size, family, bold, italic, color, etc.) | **Supported** | Yes | Complete font formatting model |
| **Cell** | `cell.fill` (pattern, fgColor, bgColor) | **Supported** | Yes | Pattern fill & color model |
| **Cell** | `cell.border` (top, bottom, left, right, diagonal) | **Supported** | Yes | Border styles and colors |
| **Cell** | `cell.alignment` (horizontal, vertical, wrapText, shrinkToFit) | **Supported** | Yes | Alignment & text rotation properties |
| **Cell** | `cell.numFmt` | **Supported** | Yes | Number formatting string support |
| **Cell** | `cell.note` / `cell.hyperlink` / `cell.dataValidation` | **Supported** | Yes | Comments, hyperlinks, and data validation rules |
| **Opaque OOXML** | Unmodeled OOXML parts (VBA, Custom XML) | **Preserved (Opaque)** | Yes | Retained byte-for-byte via `assertNoSilentLoss()` |
