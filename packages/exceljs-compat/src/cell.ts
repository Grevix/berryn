import type { Alignment, Borders, CellProtection, Fill, Font } from './style.js';

export interface RichText {
  text: string;
  font?: Font;
}

export interface CellFormulaValue {
  formula: string;
  result?: string | number | boolean | Date;
  sharedFormula?: string;
}

export interface CellHyperlinkValue {
  text: string;
  hyperlink: string;
  tooltip?: string;
}

export interface CellErrorValue {
  error: '#N/A' | '#VALUE!' | '#REF!' | '#NAME?' | '#NUM!' | '#NULL!' | '#DIV/0!';
}

export type CellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | CellFormulaValue
  | CellHyperlinkValue
  | CellErrorValue
  | { richText: RichText[] };

export interface CommentText {
  text: string;
  font?: Font;
}

export interface Comment {
  author?: string;
  texts?: CommentText[];
}

export interface DataValidation {
  type: 'list' | 'whole' | 'decimal' | 'date' | 'textLength' | 'custom';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between' | 'notBetween';
  allowBlank?: boolean;
  formula1?: string | number | Date;
  formula2?: string | number | Date;
  showInputMessage?: boolean;
  showErrorMessage?: boolean;
  errorTitle?: string;
  error?: string;
  promptTitle?: string;
  prompt?: string;
}

export class Cell {
  private _value: CellValue = null;

  public font?: Font;
  public fill?: Fill;
  public border?: Borders;
  public alignment?: Alignment;
  public numFmt?: string;
  public protection?: CellProtection;
  public note?: string | Comment;
  public hyperlink?: string | CellHyperlinkValue;
  public dataValidation?: DataValidation;

  constructor(public readonly address: string) {}

  get value(): CellValue {
    return this._value;
  }

  set value(val: CellValue) {
    this._value = val;
  }

  get text(): string {
    if (this._value === null || this._value === undefined) return '';
    if (typeof this._value === 'string') return this._value;
    if (typeof this._value === 'number' || typeof this._value === 'boolean') return String(this._value);
    if (this._value instanceof Date) return this._value.toISOString();
    if (typeof this._value === 'object') {
      if ('formula' in this._value) return String(this._value.result ?? '');
      if ('hyperlink' in this._value) return this._value.text;
      if ('error' in this._value) return this._value.error;
      if ('richText' in this._value) return this._value.richText.map((rt) => rt.text).join('');
    }
    return '';
  }

  get formula(): string | undefined {
    if (this._value && typeof this._value === 'object' && 'formula' in this._value) {
      return this._value.formula;
    }
    return undefined;
  }

  get result(): string | number | boolean | Date | undefined {
    if (this._value && typeof this._value === 'object' && 'result' in this._value) {
      return this._value.result;
    }
    return undefined;
  }
}
