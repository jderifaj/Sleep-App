import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getEnv(name: string): string {
  const value = import.meta.env?.[name] ?? process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function sha256(input: string): Buffer {
  return createHash('sha256').update(input).digest();
}

export function passwordMatches(submitted: string): boolean {
  const expected = sha256(getEnv('SITE_PASSWORD'));
  const actual = sha256(submitted);
  return timingSafeEqual(expected, actual);
}

function sign(payload: string): string {
  return createHmac('sha256', getEnv('COOKIE_SECRET')).update(payload).digest('hex');
}

export function createSessionToken(): string {
  const expiry = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = String(expiry);
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload), 'hex');
  const actual = Buffer.from(signature, 'hex');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

  const expiry = Number(payload);
  return Number.isFinite(expiry) && Date.now() < expiry;
}

export function parseCookies(cookieHeader: string | null | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (!key) continue;
    cookies[key] = decodeURIComponent(rest.join('='));
  }
  return cookies;
}

export function isRequestAuthenticated(cookieHeader: string | null | undefined): boolean {
  const cookies = parseCookies(cookieHeader);
  return isValidSessionToken(cookies[SESSION_COOKIE_NAME]);
}

export function buildSessionCookie(): string {
  const token = createSessionToken();
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function buildLogoutCookie(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
