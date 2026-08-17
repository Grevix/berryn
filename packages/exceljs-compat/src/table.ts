export interface TableColumn {
  name: string;
  totalsRowLabel?: string;
  totalsRowFunction?: 'none' | 'average' | 'count' | 'countNums' | 'max' | 'min' | 'stdDev' | 'sum' | 'var';
  filterButton?: boolean;
}

export interface TableOptions {
  name: string;
  ref: string;
  headerRow?: boolean;
  totalsRow?: boolean;
  style?: {
    theme?: 'TableStyleLight1' | 'TableStyleMedium1' | 'TableStyleDark1' | string;
    showRowStripes?: boolean;
    showColumnStripes?: boolean;
  };
  columns: TableColumn[];
  rows?: any[][];
}

export class Table {
  public name: string;
  public ref: string;
  public headerRow: boolean;
  public totalsRow: boolean;
  public style?: TableOptions['style'];
  public columns: TableColumn[];

  constructor(options: TableOptions) {
    this.name = options.name;
    this.ref = options.ref;
    this.headerRow = options.headerRow !== undefined ? options.headerRow : true;
    this.totalsRow = options.totalsRow !== undefined ? options.totalsRow : false;
    this.style = options.style;
    this.columns = options.columns;
  }
}
