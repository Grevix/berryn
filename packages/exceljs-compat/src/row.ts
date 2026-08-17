import { Cell, type CellValue } from './cell.js';
import type { Alignment, Borders, Fill, Font } from './style.js';

export class Row {
  private cells = new Map<number, Cell>();
  public height?: number;
  public hidden = false;
  public outlineLevel = 0;
  public font?: Font;
  public fill?: Fill;
  public border?: Borders;
  public alignment?: Alignment;

  constructor(public readonly number: number, private getCellByColIndex: (col: number) => Cell) {}

  getCell(col: number | string): Cell {
    let colIndex = typeof col === 'number' ? col : col.charCodeAt(0) - 64;
    let cell = this.cells.get(colIndex);
    if (!cell) {
      cell = this.getCellByColIndex(colIndex);
      this.cells.set(colIndex, cell);
    }
    return cell;
  }

  eachCell(callback: (cell: Cell, colNumber: number) => void): void {
    this.cells.forEach((cell, colNumber) => {
      callback(cell, colNumber);
    });
  }

  get values(): CellValue[] {
    const vals: CellValue[] = [];
    this.cells.forEach((cell, colNumber) => {
      vals[colNumber] = cell.value;
    });
    return vals;
  }

  set values(vals: CellValue[]) {
    if (vals.length > 0 && vals[0] !== null && vals[0] !== undefined) {
      vals.forEach((val, idx) => {
        const cell = this.getCell(idx + 1);
        cell.value = val;
      });
    } else {
      vals.forEach((val, idx) => {
        if (idx > 0) {
          const cell = this.getCell(idx);
          cell.value = val;
        }
      });
    }
  }
}
