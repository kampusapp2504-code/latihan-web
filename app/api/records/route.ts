import { google } from "googleapis";
import { NextResponse } from "next/server";

const spreadsheetId = process.env.GOOGLE_SHEET_ID || "1svp7av4wpn6HzgrC7FpdXnjFWCKtiHq2rItxWcE4FbE";
const sheetName = process.env.GOOGLE_SHEET_NAME || "Sheet1";
const columns = ["order_id", "date", "product", "category", "price", "quantity", "city", "customer"];

type RecordBody = Record<(typeof columns)[number], string>;

async function callAppsScript(action: "create" | "update" | "delete", body: RecordBody | { order_id: string }) {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!url) return null;
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...body }), cache: "no-store" });
  if (response.url.includes("accounts.google.com") || response.status === 401 || response.status === 403) {
    throw new Error("Apps Script meminta login. Deploy ulang sebagai Web app dengan 'Who has access: Anyone'.");
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("Apps Script tidak mengembalikan JSON. Pastikan URL deployment berakhiran /exec dan aksesnya Anyone.");
  const result = await response.json();
  if (!response.ok || result.error) throw new Error(result.error || `Apps Script merespons status ${response.status}.`);
  return result;
}

function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("Google Service Account belum dikonfigurasi.");
  const auth = new google.auth.GoogleAuth({ credentials: { client_email: email, private_key: key }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  return google.sheets({ version: "v4", auth });
}

function valuesFromBody(body: RecordBody) {
  return columns.map((column) => body[column] ?? "");
}

async function findRow(sheets: ReturnType<typeof google.sheets>, orderId: string) {
  const result = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A:H` });
  const values = result.data.values ?? [];
  const rowIndex = values.findIndex((row) => row[0] === orderId);
  return { values, rowIndex };
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Operasi Google Sheets gagal.";
  const status = message.includes("belum dikonfigurasi") ? 503 : message.includes("meminta login") || message.includes("Who has access") ? 401 : 500;
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RecordBody;
    if (!body.order_id || !body.product || !body.date) return NextResponse.json({ error: "Order ID, tanggal, dan produk wajib diisi." }, { status: 400 });
    const appsScriptResult = await callAppsScript("create", body);
    if (appsScriptResult) return NextResponse.json({ ok: true, provider: "apps-script" });
    const sheets = getSheets();
    const existing = await findRow(sheets, body.order_id);
    if (existing.rowIndex > 0) return NextResponse.json({ error: "Order ID sudah digunakan." }, { status: 409 });
    await sheets.spreadsheets.values.append({ spreadsheetId, range: `${sheetName}!A:H`, valueInputOption: "USER_ENTERED", requestBody: { values: [valuesFromBody(body)] } });
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as RecordBody;
    const currentOrderId = typeof body.current_order_id === "string" ? body.current_order_id : body.order_id;
    const appsScriptResult = await callAppsScript("update", body);
    if (appsScriptResult) return NextResponse.json({ ok: true, provider: "apps-script" });
    const sheets = getSheets();
    const existing = await findRow(sheets, currentOrderId);
    if (existing.rowIndex < 1) return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
    await sheets.spreadsheets.values.update({ spreadsheetId, range: `${sheetName}!A${existing.rowIndex + 1}:H${existing.rowIndex + 1}`, valueInputOption: "USER_ENTERED", requestBody: { values: [valuesFromBody(body)] } });
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request: Request) {
  try {
    const { order_id: orderId } = await request.json() as { order_id: string };
    const appsScriptResult = await callAppsScript("delete", { order_id: orderId });
    if (appsScriptResult) return NextResponse.json({ ok: true, provider: "apps-script" });
    const sheets = getSheets();
    const existing = await findRow(sheets, orderId);
    if (existing.rowIndex < 1) return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });
    const metadata = await sheets.spreadsheets.get({ spreadsheetId, fields: "sheets(properties(sheetId,title))" });
    const sheet = metadata.data.sheets?.find((item) => item.properties?.title === sheetName);
    if (sheet?.properties?.sheetId === undefined) return NextResponse.json({ error: `Sheet '${sheetName}' tidak ditemukan.` }, { status: 404 });
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests: [{ deleteDimension: { range: { sheetId: sheet.properties.sheetId, dimension: "ROWS", startIndex: existing.rowIndex, endIndex: existing.rowIndex + 1 } } }] } });
    return NextResponse.json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
