import type { Context } from '@netlify/functions';
import { buildLogoutCookie } from '../../src/lib/auth';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': buildLogoutCookie(),
    },
  });
};
