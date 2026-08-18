import { defineMiddleware } from 'astro:middleware';
import { isRequestAuthenticated } from './lib/auth';

const PUBLIC_PATHS = new Set(['/login']);

export const onRequest = defineMiddleware((context, next) => {
  if (PUBLIC_PATHS.has(context.url.pathname)) {
    return next();
  }

  if (!isRequestAuthenticated(context.request.headers.get('cookie'))) {
    return context.redirect('/login');
  }

  return next();
});
