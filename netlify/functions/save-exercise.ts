import type { Context } from '@netlify/functions';
import { isRequestAuthenticated } from '../../src/lib/auth';
import { todayKey } from '../../src/lib/date';
import { upsertEntry } from '../../src/lib/sheets';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  if (!isRequestAuthenticated(req.headers.get('cookie'))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body: { exercised?: boolean; exercise_activity?: string; exercise_time?: string } =
    await req.json();

  await upsertEntry(todayKey(), {
    exercised: Boolean(body.exercised),
    exercise_activity: body.exercised ? (body.exercise_activity ?? '') : '',
    exercise_time: body.exercised ? (body.exercise_time ?? '') : '',
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
