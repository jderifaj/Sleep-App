import { JWT } from 'google-auth-library';
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetRow,
  type GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { EMPTY_ENTRY, type DailyEntry } from './types';

let cachedSheet: GoogleSpreadsheetWorksheet | null = null;

const COLUMNS = [
  'date',
  'food_log',
  'night_activity',
  'bedtime',
  'exercised',
  'exercise_activity',
  'exercise_minutes',
  'trouble_falling_asleep',
  'woke_in_night',
  'wake_count',
  'notes',
  'last_updated',
];

function getEnv(name: string): string {
  const value = import.meta.env?.[name] ?? process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function ensureColumns(sheet: GoogleSpreadsheetWorksheet): Promise<void> {
  await sheet.loadHeaderRow();
  const missing = COLUMNS.filter((c) => !sheet.headerValues.includes(c));
  if (missing.length) {
    await sheet.setHeaderRow([...sheet.headerValues, ...missing]);
  }
}

async function getSheet(): Promise<GoogleSpreadsheetWorksheet> {
  if (cachedSheet) return cachedSheet;

  const auth = new JWT({
    email: getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    key: getEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(getEnv('GOOGLE_SHEET_ID'), auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByTitle['Entries'];
  if (!sheet) throw new Error('Sheet tab "Entries" not found in the target spreadsheet');

  await ensureColumns(sheet);

  cachedSheet = sheet;
  return sheet;
}

function toBool(value: unknown): boolean {
  return value === true || value === 'TRUE' || value === 'true';
}

function toNum(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function rowToEntry(dateKey: string, row: GoogleSpreadsheetRow): DailyEntry {
  return {
    date: dateKey,
    food_log: row.get('food_log') ?? '',
    night_activity: row.get('night_activity') ?? '',
    bedtime: row.get('bedtime') ?? '',
    exercised: toBool(row.get('exercised')),
    exercise_activity: row.get('exercise_activity') ?? '',
    exercise_minutes: toNum(row.get('exercise_minutes')),
    trouble_falling_asleep: toBool(row.get('trouble_falling_asleep')),
    woke_in_night: toBool(row.get('woke_in_night')),
    wake_count: toNum(row.get('wake_count')),
    notes: row.get('notes') ?? '',
    last_updated: row.get('last_updated') ?? '',
  };
}

export async function getEntry(dateKey: string): Promise<DailyEntry> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get('date') === dateKey);

  if (!row) {
    return { date: dateKey, ...EMPTY_ENTRY };
  }

  return rowToEntry(dateKey, row);
}

export async function listEntries(): Promise<DailyEntry[]> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  return rows
    .map((row) => rowToEntry(row.get('date'), row))
    .filter((entry) => entry.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function upsertEntry(
  dateKey: string,
  patch: Record<string, string | boolean | number>
): Promise<void> {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  let row = rows.find((r) => r.get('date') === dateKey);

  if (!row) {
    row = await sheet.addRow({ date: dateKey }, { raw: true });
  }

  for (const [key, value] of Object.entries(patch)) {
    row.set(key, typeof value === 'boolean' ? (value ? 'TRUE' : 'FALSE') : value);
  }
  row.set('last_updated', new Date().toISOString());

  await row.save({ raw: true });
}
