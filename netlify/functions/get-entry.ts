import type { Context } from '@netlify/functions';
import { isValidDateKey, todayKey } from '../../src/lib/date';
import { getEntry } from '../../src/lib/sheets';

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const requestedDate = url.searchParams.get('date');
  const dateKey = requestedDate && isValidDateKey(requestedDate) ? requestedDate : todayKey();

  const entry = await getEntry(dateKey);

  return new Response(JSON.stringify(entry), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
