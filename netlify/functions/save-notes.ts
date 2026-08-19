import type { Context } from '@netlify/functions';
import { isValidDateKey, todayKey } from '../../src/lib/date';
import { upsertEntry } from '../../src/lib/sheets';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body: { date?: string; notes?: string } = await req.json();
  const dateKey = body.date && isValidDateKey(body.date) ? body.date : todayKey();

  await upsertEntry(dateKey, {
    notes: body.notes ?? '',
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
