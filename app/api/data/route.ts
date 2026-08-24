import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const fallbackPath = path.join(process.cwd(), "data", "sales.csv");
const defaultSheetUrl = "https://docs.google.com/spreadsheets/d/1svp7av4wpn6HzgrC7FpdXnjFWCKtiHq2rItxWcE4FbE/gviz/tq?tqx=out:csv&gid=0";

function parseCsv(input: string) {
  const lines = input.trim().split(/\r?\n/);
  const parseLine = (line: string) => {
    const values: string[] = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"' && line[index + 1] === '"' && quoted) {
        value += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === "," && !quoted) {
        values.push(value.trim());
        value = "";
      } else {
        value += character;
      }
    }
    values.push(value.trim());
    return values;
  };
  const headerLine = lines.shift() ?? "";
  const headers = parseLine(headerLine);
  return lines.filter(Boolean).map((line) => {
    const values = parseLine(line);
    return headers.reduce<Record<string, string>>((row, header, index) => {
      row[header] = (values[index] ?? "").trim();
      return row;
    }, {});
  });
}

export async function GET() {
  const source = process.env.GOOGLE_SHEET_CSV_URL || defaultSheetUrl;
  try {
    const liveSource = source ? `${source}${source.includes("?") ? "&" : "?"}_=${Date.now()}` : "";
    const response = liveSource ? await fetch(liveSource, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }) : null;
    const csv = response?.ok ? await response.text() : await readFile(fallbackPath, "utf8");
    return NextResponse.json({ rows: parseCsv(csv), source: response?.ok ? "google-sheets" : "local-fallback", syncedAt: new Date().toISOString(), connectionIssue: response?.ok ? null : `Google Sheets merespons status ${response?.status ?? "tidak tersedia"}.` }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    const csv = await readFile(fallbackPath, "utf8");
    return NextResponse.json({ rows: parseCsv(csv), source: "local-fallback", syncedAt: new Date().toISOString(), connectionIssue: "Google Sheets tidak dapat diakses dari server." }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}
