import { z } from 'zod';
import { DB } from '../lib/db';
import rand from '../lib/csprng';
import { Env, ZodUserEmail } from '../lib/types';
import { makeErrorResponse } from '../lib/utils';

const SendVerificationCodeRequest = z.object({
  email: ZodUserEmail,
  recaptchaChallenge: z.string().min(1),
});

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  let req: {
    email: string;
    recaptchaChallenge: string;
  };

  try {
    const json = await request.json();
    req = SendVerificationCodeRequest.parse(json);
  } catch (e) {
    console.error(e);
    return makeErrorResponse(`cannot_parse_request`, 400, e);
  }

  try {
    const form = new FormData();
    form.set('secret', env.GRECAPTCHA_SECRET);
    form.set('response', req.recaptchaChallenge);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: form,
    });
    const json: {
      success: boolean;
      'error-codes': string[] | null | undefined;
    } = await res.json();
    if (!json.success) {
      throw new Error(
        'recaptcha did not succeed, error codes: ' +
          JSON.stringify(json['error-codes'])
      );
    }
  } catch (e) {
    console.error(e);
    return makeErrorResponse('recaptcha_failed');
  }

  let db = new DB(
    env.FIREBASE_RTDB_URL,
    JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
  );

  try {
    let attempts = await db.getSendVerificationCodeAttempts(req.email);
    let rateLimitExceeded =
      attempts.filter((attempt) => {
        let minsDiff = (Date.now() - attempt.creationTime) / 1000 / 60;
        return minsDiff < 5;
      }).length > 20;
    if (rateLimitExceeded) {
      return makeErrorResponse('ratelimit', 429);
    }
  } catch (e) {
    console.error(e);
    return makeErrorResponse('cannot_enforce_ratelimit', 500);
  }

  let code: string;
  try {
    code = rand(32, 10).slice(0, 6);
    await db.setAuthCodeForTarget(req.email, code, Date.now() + 5 * 60 * 1000);
  } catch (e: any) {
    console.error(e);
    return makeErrorResponse('cannot_write_code_to_databse', 500);
  }

  try {
    const res = await fetch(
      'https://apis.verylowmaint.com/smtp-bridge/v1/send',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${env.SMTP_BRIDGE_TOKEN}`,
        },
        body: JSON.stringify({
          to: {
            address: req.email,
          },
          from: {
            address: env.MAIL_FROM,
            name: '資想見你籌備小組',
          },
          subject: '[資想見你-四資迎新] 報名系統驗證信',
          plainTextBody: `你好，
你會收到這封信，是因為有人（可能就是你！）在資想見你報名系統輸入了你的電子郵件地址。
如果是你本人在驗證的話，請在網頁中輸入以下六位數驗證碼：
${code}

驗證碼僅在五分鐘內有效。

如果並非你本人操作，也許只是有人不小心填錯了，你可以直接刪除這封信！
要是你一直收到本次活動的驗證信，覺得很困擾的話，請直接回覆此信，並說明你的狀況，我們會儘速處理。

資想見你籌備小組
`,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(
        `smtp-bridge: server returned status code ${
          res.status
        }. Body:\n${await res.text()}`
      );
    }
    let sendResult: any = await res.json();
    console.log(sendResult);
    if (sendResult.rejected.length !== 0) {
      throw new Error('smtp-bridge: detected rejected recipient');
    }
  } catch (e) {
    await db.recordSendVerificationCodeAttempt({
      request,
      target: req.email,
      success: false,
      errorMessage: 'cannot_send_email',
    });
    console.error(e);
    return makeErrorResponse('cannot_send_email', 500);
  }

  try {
    await db.recordSendVerificationCodeAttempt({
      request,
      target: req.email,
      success: true,
    });
  } catch (e: any) {
    return makeErrorResponse('cannot_write_audit_log', 500);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
};
