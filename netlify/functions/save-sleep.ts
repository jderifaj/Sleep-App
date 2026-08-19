import type { Context } from '@netlify/functions';
import { todayKey } from '../../src/lib/date';
import { upsertEntry } from '../../src/lib/sheets';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const body: { trouble_falling_asleep?: boolean; woke_in_night?: boolean; wake_count?: number } =
    await req.json();

  await upsertEntry(todayKey(), {
    trouble_falling_asleep: Boolean(body.trouble_falling_asleep),
    woke_in_night: Boolean(body.woke_in_night),
    wake_count: body.woke_in_night ? Number(body.wake_count) || 0 : 0,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
