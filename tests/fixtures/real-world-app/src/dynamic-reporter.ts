import ExcelJS from 'exceljs';

export async function dynamicReportExport(workbook: any, method: string, path: string): Promise<void> {
  // Ambiguous dynamic index expression
  await workbook.xlsx[method](path);
}
