import type { Alignment, Borders, Fill, Font } from './style.js';

export class Column {
  public width?: number;
  public hidden = false;
  public outlineLevel = 0;
  public font?: Font;
  public fill?: Fill;
  public border?: Borders;
  public alignment?: Alignment;
  public key?: string;
  public header?: string | string[];

  constructor(public readonly number: number, public readonly letter: string) {}
}
