import { createHash } from 'node:crypto';

export interface WorksheetProtectionOptions {
  selectLockedCells?: boolean;
  selectUnlockedCells?: boolean;
  formatCells?: boolean;
  formatColumns?: boolean;
  formatRows?: boolean;
  insertColumns?: boolean;
  insertRows?: boolean;
  insertHyperlinks?: boolean;
  deleteColumns?: boolean;
  deleteRows?: boolean;
  sort?: boolean;
  autoFilter?: boolean;
  pivotTables?: boolean;
  spinCount?: number;
}

export class WorksheetProtection {
  public isProtected = false;
  public passwordHash?: string;
  public spinCount = 100000;

  public selectLockedCells = true;
  public selectUnlockedCells = true;
  public formatCells = false;
  public formatColumns = false;
  public formatRows = false;
  public insertColumns = false;
  public insertRows = false;
  public insertHyperlinks = false;
  public deleteColumns = false;
  public deleteRows = false;
  public sort = false;
  public autoFilter = false;
  public pivotTables = false;

  protect(password?: string, options?: WorksheetProtectionOptions): void {
    this.isProtected = true;
    if (password) {
      this.passwordHash = createHash('sha512').update(password).digest('hex');
    }
    if (options) {
      if (options.spinCount !== undefined) this.spinCount = options.spinCount;
      if (options.selectLockedCells !== undefined) this.selectLockedCells = options.selectLockedCells;
      if (options.selectUnlockedCells !== undefined) this.selectUnlockedCells = options.selectUnlockedCells;
      if (options.formatCells !== undefined) this.formatCells = options.formatCells;
      if (options.formatColumns !== undefined) this.formatColumns = options.formatColumns;
      if (options.formatRows !== undefined) this.formatRows = options.formatRows;
      if (options.insertColumns !== undefined) this.insertColumns = options.insertColumns;
      if (options.insertRows !== undefined) this.insertRows = options.insertRows;
      if (options.insertHyperlinks !== undefined) this.insertHyperlinks = options.insertHyperlinks;
      if (options.deleteColumns !== undefined) this.deleteColumns = options.deleteColumns;
      if (options.deleteRows !== undefined) this.deleteRows = options.deleteRows;
      if (options.sort !== undefined) this.sort = options.sort;
      if (options.autoFilter !== undefined) this.autoFilter = options.autoFilter;
      if (options.pivotTables !== undefined) this.pivotTables = options.pivotTables;
    }
  }

  unprotect(): void {
    this.isProtected = false;
    delete this.passwordHash;
  }

  toXmlNode(): string {
    if (!this.isProtected) return '';
    const hashAttr = this.passwordHash ? ` algorithmName="SHA-512" hashValue="${this.passwordHash}" spinCount="${this.spinCount}"` : '';
    return `<sheetProtection sheet="1" objects="1" scenarios="1"${hashAttr} selectLockedCells="${this.selectLockedCells ? 1 : 0}" selectUnlockedCells="${this.selectUnlockedCells ? 1 : 0}" formatCells="${this.formatCells ? 1 : 0}" formatColumns="${this.formatColumns ? 1 : 0}" formatRows="${this.formatRows ? 1 : 0}" insertColumns="${this.insertColumns ? 1 : 0}" insertRows="${this.insertRows ? 1 : 0}" insertHyperlinks="${this.insertHyperlinks ? 1 : 0}" deleteColumns="${this.deleteColumns ? 1 : 0}" deleteRows="${this.deleteRows ? 1 : 0}" sort="${this.sort ? 1 : 0}" autoFilter="${this.autoFilter ? 1 : 0}" pivotTables="${this.pivotTables ? 1 : 0}"/>`;
  }
}
