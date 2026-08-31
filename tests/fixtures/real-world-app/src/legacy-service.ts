const ExcelJS = require('exceljs');

function processLegacyExport(filePath: string) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Legacy Data');
  ws.addRow(['ID', 'Status']);
  ws.addRow([101, 'ACTIVE']);
  return workbook;
}

module.exports = { processLegacyExport };
