import { z } from 'zod';
import { DB } from '../lib/db';
import { Env, ZodUserEmail } from '../lib/types';
import { makeErrorResponse, SessionCookieKey } from '../lib/utils';
import * as Cookie from 'cookie';
import jwt from '@tsndr/cloudflare-worker-jwt';

const AuthenticateRequest = z.object({
  email: ZodUserEmail,
  code: z.string().trim().length(6),
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let req: z.infer<typeof AuthenticateRequest>;
  try {
    let raw = await request.json();
    req = AuthenticateRequest.parse(raw);
  } catch (e) {
    console.error(e);
    return makeErrorResponse(`cannot_parse_request`, 400, e);
  }

  let db = new DB(
    env.FIREBASE_RTDB_URL,
    JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
  );
  let attempts = await db.getPresentVerificationCodeAttempts(req.email);
  let rateLimitExceeded =
    attempts
      .map((attempt) => Date.now() - attempt.creationTime)
      .map((msDiff) => msDiff / 1000 / 60)
      .filter((minDiff) => minDiff < 1).length > 10;

  if (rateLimitExceeded) {
    return makeErrorResponse(`ratelimit`, 429);
  }

  let authCode = await db.getAuthCodeForTarget(req.email);
  if (!authCode || Date.now() > authCode.expiry || req.code !== authCode.code) {
    if (authCode) {
      await db.recordPresentVerificationCodeAttempt({
        request,
        success: false,
        target: req.email,
      });
    }

    return makeErrorResponse(`code_failed`, 401);
  }

  await db.deleteAuthCodeForTarget(req.email);
  await db.recordPresentVerificationCodeAttempt({
    request,
    success: true,
    target: req.email,
  });

  let exp = Math.floor(Date.now() / 1000);
  exp += 60 * 60;

  let token = await jwt.sign(
    {
      sub: req.email,
      exp,
    },
    env.JWT_SECRET
  );

  let cookie = Cookie.serialize(
    SessionCookieKey,
    token,
    {
      httpOnly: true,
      secure: true,
      path: '/api',
      sameSite: 'strict',
      maxAge: 60 * 60,
    }
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'content-type': 'application/json',
      'set-cookie': cookie,
    },
  });
};

export const onRequestDelete: PagesFunction = () => {
  let cookie = Cookie.serialize(
    SessionCookieKey,
    '',
    {
      httpOnly: true,
      secure: true,
      path: '/api',
      sameSite: 'strict',
      maxAge: 0,
    }
  );

  return new Response(null, {
    headers: {
      'set-cookie': cookie,
    },
    status: 204,
  });
};

export async function getAuthenticatedSubject(
  request: Request,
  secret: string
): Promise<string | null | undefined> {
  let cookies = Cookie.parse(request.headers.get('cookie') ?? '');
  if (!cookies[SessionCookieKey]) return null;
  let valid = await jwt.verify(cookies[SessionCookieKey], secret);
  if (!valid) return null;
  let { payload } = jwt.decode(cookies[SessionCookieKey]);
  return payload.sub;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  let sub = await getAuthenticatedSubject(request, env.JWT_SECRET);

  if (!sub) {
    return new Response(null, {
      status: 401,
    });
  }

  return new Response(JSON.stringify({ email: sub }), {
    headers: {
      'content-type': 'application/json',
    },
    status: 200,
  });
};
