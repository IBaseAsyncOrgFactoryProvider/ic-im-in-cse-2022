import { z } from 'zod';

const CSRFChecker: PagesFunction = async (context) => {
  if (!context.request.headers.has('X-No-CSRF')) {
    return new Response('CSRF header is not present.', { status: 400 })
  }
  const hi = z.string();

  return context.next()
}

export const onRequest = [CSRFChecker]
