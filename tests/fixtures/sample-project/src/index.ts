import ExcelJS from 'exceljs';

export async function processReport(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet('Summary');
  console.log(sheet?.name);
}
