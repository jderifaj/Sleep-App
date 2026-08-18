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

  const body: { night_activity?: string; bedtime?: string } = await req.json();

  await upsertEntry(todayKey(), {
    night_activity: body.night_activity ?? '',
    bedtime: body.bedtime ?? '',
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
