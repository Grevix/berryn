import { Cell, type CellValue } from './cell.js';
import { Column } from './column.js';
import { PivotTable, type PivotTableOptions } from './pivot.js';
import { WorksheetProtection, type WorksheetProtectionOptions } from './protection.js';
import { Row } from './row.js';
import { Table, type TableOptions } from './table.js';

export interface PageSetup {
  orientation?: 'portrait' | 'landscape';
  paperSize?: number;
  margins?: { left?: number; right?: number; top?: number; bottom?: number; header?: number; footer?: number };
  fitToPage?: boolean;
  fitToWidth?: number;
  fitToHeight?: number;
  printArea?: string;
}

export interface WorksheetView {
  state?: 'normal' | 'frozen' | 'split';
  xSplit?: number;
  ySplit?: number;
  activeCell?: string;
  showGridLines?: boolean;
}

export interface ImageAnchor {
  tl: { col: number; row: number };
  br?: { col: number; row: number };
  ext?: { width: number; height: number };
  editAs?: 'oneCell' | 'twoCell' | 'absolute';
}

export interface WorksheetImage {
  imageId: string;
  range: string | ImageAnchor;
}

export class Worksheet {
  private cells = new Map<string, Cell>();
  private rowsMap = new Map<number, Row>();
  private colsMap = new Map<number, Column>();
  private mergedRanges = new Set<string>();

  public state: 'visible' | 'hidden' | 'veryHidden' = 'visible';
  public protection = new WorksheetProtection();
  public pivotTables: PivotTable[] = [];
  public tables: Table[] = [];
  public images: WorksheetImage[] = [];
  public autoFilter?: string;
  public pageSetup: PageSetup = {};
  public views: WorksheetView[] = [{ state: 'normal', showGridLines: true }];

  constructor(public name: string, public readonly id: number) {}

  getCell(addressOrRow: string | number, col?: number): Cell {
    let address: string;
    if (typeof addressOrRow === 'number' && typeof col === 'number') {
      const colLetter = String.fromCharCode(65 + col - 1);
      address = `${colLetter}${addressOrRow}`;
    } else {
      address = String(addressOrRow);
    }

    let cell = this.cells.get(address);
    if (!cell) {
      cell = new Cell(address);
      this.cells.set(address, cell);
    }
    return cell;
  }

  getRow(rowNumber: number): Row {
    let row = this.rowsMap.get(rowNumber);
    if (!row) {
      row = new Row(rowNumber, (colIndex) => this.getCell(rowNumber, colIndex));
      this.rowsMap.set(rowNumber, row);
    }
    return row;
  }

  getColumn(colIndexOrKey: number | string): Column {
    const colNumber = typeof colIndexOrKey === 'number' ? colIndexOrKey : colIndexOrKey.charCodeAt(0) - 64;
    let col = this.colsMap.get(colNumber);
    if (!col) {
      const letter = String.fromCharCode(65 + colNumber - 1);
      col = new Column(colNumber, letter);
      this.colsMap.set(colNumber, col);
    }
    return col;
  }

  addRow(values: CellValue[]): Row {
    const rowNumber = this.rowsMap.size + 1;
    const row = this.getRow(rowNumber);
    row.values = values;
    return row;
  }

  addRows(valuesArray: CellValue[][]): Row[] {
    return valuesArray.map((vals) => this.addRow(vals));
  }

  insertRow(pos: number, values: CellValue[]): Row {
    const row = this.getRow(pos);
    row.values = values;
    return row;
  }

  insertRows(pos: number, valuesArray: CellValue[][]): Row[] {
    return valuesArray.map((vals, idx) => this.insertRow(pos + idx, vals));
  }

  spliceRows(start: number, count: number, ...insertRows: CellValue[][]): void {
    insertRows.forEach((vals, idx) => {
      this.insertRow(start + idx, vals);
    });
  }

  eachRow(callback: (row: Row, rowNumber: number) => void): void {
    this.rowsMap.forEach((row, rowNumber) => {
      callback(row, rowNumber);
    });
  }

  getSheetValues(): CellValue[][] {
    const result: CellValue[][] = [];
    this.rowsMap.forEach((row, rowNumber) => {
      result[rowNumber] = row.values;
    });
    return result;
  }

  get actualRowCount(): number {
    return this.rowsMap.size;
  }

  get actualColumnCount(): number {
    return this.colsMap.size;
  }

  mergeCells(range: string): void {
    this.mergedRanges.add(range);
  }

  unMergeCells(range: string): void {
    this.mergedRanges.delete(range);
  }

  get MergedRanges(): string[] {
    return Array.from(this.mergedRanges);
  }

  protect(password?: string, options?: WorksheetProtectionOptions): void {
    this.protection.protect(password, options);
  }

  unprotect(): void {
    this.protection.unprotect();
  }

  addPivotTable(options: PivotTableOptions): PivotTable {
    const pt = new PivotTable(options);
    this.pivotTables.push(pt);
    return pt;
  }

  addTable(options: TableOptions): Table {
    const tbl = new Table(options);
    this.tables.push(tbl);
    return tbl;
  }

  addImage(imageId: string, range: string | ImageAnchor): void {
    this.images.push({ imageId, range });
  }
}
