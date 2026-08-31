import { Workbook } from 'exceljs';

export function createWorkbook() {
  const wb = new Workbook();
  wb.creator = 'Berryn Test';
  return wb;
}
