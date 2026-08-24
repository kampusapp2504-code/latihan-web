const SHEET_NAME = 'sales';
const COLUMNS = ['order_id', 'date', 'product', 'category', 'price', 'quantity', 'city', 'customer'];

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
    if (!sheet) throw new Error('Spreadsheet tidak memiliki tab sheet yang dapat digunakan.');
    const values = sheet.getDataRange().getValues();
    const orderColumn = 0;
    const lookupOrderId = payload.action === 'update' && payload.current_order_id ? payload.current_order_id : payload.order_id;
    const rowIndex = values.findIndex((row, index) => index > 0 && String(row[orderColumn]) === String(lookupOrderId));

    if (payload.action === 'create') {
      if (rowIndex !== -1) throw new Error('Order ID sudah digunakan.');
      sheet.appendRow(COLUMNS.map((column) => payload[column] || ''));
    } else if (payload.action === 'update') {
      if (rowIndex === -1) throw new Error('Order tidak ditemukan.');
      sheet.getRange(rowIndex + 1, 1, 1, COLUMNS.length).setValues([COLUMNS.map((column) => payload[column] || '')]);
    } else if (payload.action === 'delete') {
      if (rowIndex === -1) throw new Error('Order tidak ditemukan.');
      sheet.deleteRow(rowIndex + 1);
    } else {
      throw new Error('Action tidak dikenal.');
    }
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message });
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
