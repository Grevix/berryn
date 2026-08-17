export interface Font {
  name?: string;
  size?: number;
  family?: number;
  scheme?: 'minor' | 'major' | 'none';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean | 'single' | 'double' | 'singleAccounting' | 'doubleAccounting';
  strike?: boolean;
  color?: { argb?: string; theme?: number };
  vertAlign?: 'superscript' | 'subscript';
  charset?: number;
}

export interface FillPattern {
  type: 'pattern';
  pattern:
    | 'none'
    | 'solid'
    | 'darkGray'
    | 'mediumGray'
    | 'lightGray'
    | 'gray125'
    | 'gray0625'
    | 'darkGrid'
    | 'darkHorizontal'
    | 'darkVertical'
    | 'darkDown'
    | 'darkUp'
    | 'lightGrid'
    | 'lightHorizontal'
    | 'lightVertical'
    | 'lightDown'
    | 'lightUp';
  fgColor?: { argb?: string; theme?: number };
  bgColor?: { argb?: string; theme?: number };
}

export interface FillGradient {
  type: 'gradient';
  gradient: 'angle' | 'path';
  degree?: number;
  stops: Array<{ position: number; color: { argb?: string } }>;
}

export type Fill = FillPattern | FillGradient;

export interface BorderStyle {
  style?:
    | 'thin'
    | 'medium'
    | 'thick'
    | 'dotted'
    | 'hair'
    | 'dashed'
    | 'mediumDashed'
    | 'dashDot'
    | 'mediumDashDot'
    | 'dashDotDot'
    | 'mediumDashDotDot'
    | 'slantDashDot'
    | 'double';
  color?: { argb?: string; theme?: number };
}

export interface Borders {
  top?: BorderStyle;
  left?: BorderStyle;
  bottom?: BorderStyle;
  right?: BorderStyle;
  diagonal?: BorderStyle & { up?: boolean; down?: boolean };
}

export interface Alignment {
  horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
  vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
  wrapText?: boolean;
  shrinkToFit?: boolean;
  indent?: number;
  textRotation?: number | 'vertical';
}

export interface CellProtection {
  locked?: boolean;
  hidden?: boolean;
}

export interface Style {
  font?: Font;
  fill?: Fill;
  border?: Borders;
  alignment?: Alignment;
  numFmt?: string;
  protection?: CellProtection;
}
