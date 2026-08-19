import type { Context } from '@netlify/functions';
import { isValidDateKey, todayKey } from '../../src/lib/date';
import { upsertEntry } from '../../src/lib/sheets';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body: {
    date?: string;
    exercised?: boolean;
    exercise_activity?: string;
    exercise_minutes?: number;
  } = await req.json();
  const dateKey = body.date && isValidDateKey(body.date) ? body.date : todayKey();

  await upsertEntry(dateKey, {
    exercised: Boolean(body.exercised),
    exercise_activity: body.exercised ? (body.exercise_activity ?? '') : '',
    exercise_minutes: body.exercised ? Number(body.exercise_minutes) || 0 : 0,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
