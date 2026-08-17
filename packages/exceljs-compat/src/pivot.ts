export interface PivotField {
  name: string;
  sort?: 'asc' | 'desc';
}

export interface PivotValueField {
  name: string;
  operation?: 'sum' | 'count' | 'average' | 'max' | 'min';
}

export interface PivotTableOptions {
  sourceSheet: string;
  sourceRange: string;
  targetSheet: string;
  targetAddress: string;
  rows?: Array<string | PivotField>;
  columns?: Array<string | PivotField>;
  values?: Array<string | PivotValueField>;
  filters?: Array<string | PivotField>;
  name?: string;
}

export class PivotTable {
  public name: string;
  public sourceSheet: string;
  public sourceRange: string;
  public targetSheet: string;
  public targetAddress: string;
  public rows: PivotField[];
  public columns: PivotField[];
  public values: PivotValueField[];
  public filters: PivotField[];

  constructor(options: PivotTableOptions) {
    this.name = options.name || `PivotTable${Math.floor(Math.random() * 10000)}`;
    this.sourceSheet = options.sourceSheet;
    this.sourceRange = options.sourceRange;
    this.targetSheet = options.targetSheet;
    this.targetAddress = options.targetAddress;
    this.rows = (options.rows || []).map((r) => (typeof r === 'string' ? { name: r } : r));
    this.columns = (options.columns || []).map((c) => (typeof c === 'string' ? { name: c } : c));
    this.values = (options.values || []).map((v) => (typeof v === 'string' ? { name: v, operation: 'sum' } : v));
    this.filters = (options.filters || []).map((f) => (typeof f === 'string' ? { name: f } : f));
  }

  toPivotTableXml(): string {
    const rowFieldsXml = this.rows.map((r) => `<field x="${r.name}"/>`).join('');
    const colFieldsXml = this.columns.map((c) => `<field x="${c.name}"/>`).join('');
    const valFieldsXml = this.values.map((v) => `<dataField name="${v.name}" subtotal="${v.operation || 'sum'}"/>`).join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" name="${this.name}" cacheId="1">
  <location ref="${this.targetAddress}" firstHeaderRow="1" firstDataRow="2" firstDataCol="1"/>
  <pivotFieldsCount="${this.rows.length + this.columns.length + this.values.length}">
    ${rowFieldsXml}${colFieldsXml}
  </pivotFieldsCount>
  <rowFields>${rowFieldsXml}</rowFields>
  <colFields>${colFieldsXml}</colFields>
  <dataFields>${valFieldsXml}</dataFields>
</pivotTableDefinition>`;
  }
}
