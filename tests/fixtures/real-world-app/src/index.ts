import ExcelJS from 'exceljs';

export async function generateQuarterlyReport(outputPath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Berryn Finance Service';

  const sheet = workbook.addWorksheet('Q3 Revenue');
  sheet.addRow(['Quarter', 'Revenue ($)', 'Growth (%)']);
  sheet.addRow(['Q3 2026', 1250000, 14.2]);

  const cell = sheet.getCell('A1');
  cell.value = 'Quarter';

  await workbook.xlsx.writeFile(outputPath);
}
