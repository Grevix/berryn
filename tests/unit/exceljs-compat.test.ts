import { describe, expect, it } from 'vitest';
import { Workbook, Worksheet, Cell, PivotTable, Table, WorksheetProtection } from '../../packages/exceljs-compat/src/index.js';

describe('@berryn/exceljs-compat (ExcelJS 4.4.0 Complete Surface)', () => {
  it('constructs workbook and sets metadata properties', () => {
    const wb = new Workbook();
    wb.creator = 'Berryn Compat Engine';
    wb.lastModifiedBy = 'Unit Tester';
    expect(wb.creator).toBe('Berryn Compat Engine');
    expect(wb.lastModifiedBy).toBe('Unit Tester');
    expect(wb.calcProperties.fullCalcOnLoad).toBe(true);
  });

  it('manages worksheets, rows, columns, and cell values', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('SalesData');
    expect(ws.name).toBe('SalesData');
    expect(wb.getWorksheet('SalesData')).toBe(ws);

    const cellA1 = ws.getCell('A1');
    cellA1.value = 'Quarterly Revenue';
    expect(cellA1.value).toBe('Quarterly Revenue');
    expect(cellA1.text).toBe('Quarterly Revenue');

    const row2 = ws.addRow(['Product A', 15000, true]);
    expect(ws.actualRowCount).toBe(1);
    expect(row2.getCell(1).value).toBe('Product A');
    expect(row2.getCell(2).value).toBe(15000);
    expect(row2.getCell(3).value).toBe(true);
  });

  it('handles rich text, formulas, hyperlinks, and errors on Cell', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('AdvancedCells');

    // Rich text
    const cellRt = ws.getCell('B2');
    cellRt.value = {
      richText: [
        { text: 'Hello ', font: { bold: true, color: { argb: 'FF0000' } } },
        { text: 'World', font: { italic: true, color: { argb: '00FF00' } } }
      ]
    };
    expect(cellRt.text).toBe('Hello World');

    // Formula
    const cellFm = ws.getCell('C3');
    cellFm.value = { formula: 'SUM(A1:A10)', result: 500 };
    expect(cellFm.formula).toBe('SUM(A1:A10)');
    expect(cellFm.result).toBe(500);

    // Hyperlink
    const cellHl = ws.getCell('D4');
    cellHl.value = { text: 'Berryn Web', hyperlink: 'https://berryn.dev' };
    expect(cellHl.text).toBe('Berryn Web');

    // Error value
    const cellErr = ws.getCell('E5');
    cellErr.value = { error: '#N/A' };
    expect(cellErr.text).toBe('#N/A');
  });

  it('applies styles (Font, Fill, Border, Alignment, NumFmt)', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('StyledSheet');
    const cell = ws.getCell('A1');
    cell.value = 1234.56;
    cell.numFmt = '$#,##0.00';
    cell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: '0000FF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
    cell.border = { top: { style: 'thin', color: { argb: '000000' } } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    expect(cell.numFmt).toBe('$#,##0.00');
    expect(cell.font.bold).toBe(true);
    expect(cell.fill.pattern).toBe('solid');
    expect(cell.border.top?.style).toBe('thin');
    expect(cell.alignment.wrapText).toBe(true);
  });

  it('handles Worksheet protection with SHA-512 XML generation', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('ProtectedSheet');
    ws.protect('SecretPassword123!', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      insertRows: true
    });

    expect(ws.protection.isProtected).toBe(true);
    expect(ws.protection.insertRows).toBe(true);
    const xml = ws.protection.toXmlNode();
    expect(xml).toContain('algorithmName="SHA-512"');
    expect(xml).toContain('insertRows="1"');
    expect(xml).toContain('formatCells="0"');

    ws.unprotect();
    expect(ws.protection.isProtected).toBe(false);
  });

  it('constructs Pivot Table definitions', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('DataSheet');
    const pt = ws.addPivotTable({
      sourceSheet: 'DataSheet',
      sourceRange: 'A1:D100',
      targetSheet: 'PivotSheet',
      targetAddress: 'A3',
      rows: ['Region', 'Category'],
      columns: ['Year'],
      values: [{ name: 'Sales', operation: 'sum' }]
    });

    expect(pt.sourceSheet).toBe('DataSheet');
    expect(pt.rows[0].name).toBe('Region');
    expect(pt.values[0].operation).toBe('sum');

    const xml = pt.toPivotTableXml();
    expect(xml).toContain('pivotTableDefinition');
    expect(xml).toContain('ref="A3"');
    expect(xml).toContain('dataField name="Sales"');
  });

  it('constructs Table definitions', () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('TableSheet');
    const tbl = ws.addTable({
      name: 'SalesTable',
      ref: 'A1:C10',
      headerRow: true,
      totalsRow: true,
      columns: [
        { name: 'Product' },
        { name: 'Q1', totalsRowFunction: 'sum' },
        { name: 'Q2', totalsRowFunction: 'sum' }
      ]
    });

    expect(tbl.name).toBe('SalesTable');
    expect(tbl.totalsRow).toBe(true);
    expect(tbl.columns[1].totalsRowFunction).toBe('sum');
  });

  it('supports Defined Names and Images', () => {
    const wb = new Workbook();
    wb.addDefinedName('TotalRevenue', 'SalesData!$B$10');
    expect(wb.definedNames[0].name).toBe('TotalRevenue');

    const imageId = wb.addImage({
      buffer: Buffer.from('fake-image-bytes'),
      extension: 'png'
    });
    expect(imageId).toBe('image_1');

    const ws = wb.getWorksheet('Sheet1') || wb.addWorksheet('Sheet1');
    ws.addImage(imageId, 'A1:C5');
    expect(ws.images[0].imageId).toBe(imageId);
  });

  it('supports CSV read and write operations', async () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('CSVData');
    ws.addRow(['Name', 'Score']);
    ws.addRow(['Alice', 95]);
    ws.addRow(['Bob', 88]);

    const buf = await wb.csv.writeBuffer();
    expect(buf.toString('utf-8')).toContain('Alice,95');

    const wb2 = await wb.csv.readFile(''); // mock path reads default text
    expect(wb2.worksheets.length).toBeGreaterThan(0);
  });
});
