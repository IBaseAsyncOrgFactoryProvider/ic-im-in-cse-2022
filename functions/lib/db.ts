import { JWTAccess } from './jwtaccess';
import {
  BaseAuthAuditLog,
  UserEmail,
  SendVerificationCodeAuthAuditLog,
  AuthAuditLogAction,
  AuthAuditLogs,
  AuthCode,
  PresentVerificationCodeAuthAuditLog,
  DBSignupInfo,
  Signup,
} from './types';

export class DB {
  private jwtAccess: JWTAccess;
  private baseUrl: string;

  constructor(
    baseUrl: string,
    credentials: Record<'client_email' | 'private_key', string>
  ) {
    this.baseUrl = baseUrl;
    this.jwtAccess = new JWTAccess(
      credentials.client_email,
      credentials.private_key
    );
  }

  async getRequestHeaders() {
    let scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/firebase.database',
    ];
    let headers = await this.jwtAccess.getRequestHeaders(
      void 0,
      void 0,
      scopes
    );
    return { headers };
  }

  makeBaseAuthAuditLog(request: Request): BaseAuthAuditLog {
    return {
      creationTime: Date.now(),
      requestMetadata: {
        userAgent: request.headers.get('user-agent') ?? '',
        ip: request.headers.get('CF-Connecting-IP') ?? '',
      },
    };
  }

  targetToFirebasePath(target: UserEmail) {
    return encodeURIComponent(target.replace(/\./g, '_'));
  }

  async recordSendVerificationCodeAttempt({
    request,
    target,
    success,
    errorMessage,
  }:
    | Pick<
        SendVerificationCodeAuthAuditLog,
        'target' | 'success' | 'errorMessage'
      > & { request: Request }) {
    let toWrite: SendVerificationCodeAuthAuditLog = {
      action: AuthAuditLogAction.SendVerificationCode,
      target,
      success,
      errorMessage,
      ...this.makeBaseAuthAuditLog(request),
    };

    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = '/authAuditLogs.json';
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(toWrite),
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }
  }

  async getSendVerificationCodeAttempts(target: UserEmail) {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = '/authAuditLogs.json';
    urlObj.searchParams.set('orderBy', '"target"');
    urlObj.searchParams.set('equalTo', `"${target}"`);
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();
    let res = await fetch(url, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }

    let raw: AuthAuditLogs | null = await res.json();
    if (raw === null) return [];
    let logs = Object.values(raw).filter(
      (log) => log.action === AuthAuditLogAction.SendVerificationCode
    );
    return logs as SendVerificationCodeAuthAuditLog[];
  }

  async recordPresentVerificationCodeAttempt({
    request,
    target,
    success,
  }:
    | Pick<
        PresentVerificationCodeAuthAuditLog,
        'target' | 'success'
      > & { request: Request }) {
    let toWrite: PresentVerificationCodeAuthAuditLog = {
      action: AuthAuditLogAction.PresentVerificationCode,
      target,
      success,
      ...this.makeBaseAuthAuditLog(request),
    };

    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = '/authAuditLogs.json';
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(toWrite),
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }
  }

  async getPresentVerificationCodeAttempts(target: UserEmail) {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = '/authAuditLogs.json';
    urlObj.searchParams.set('orderBy', '"target"');
    urlObj.searchParams.set('equalTo', `"${target}"`);
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();
    let res = await fetch(url, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }

    let raw: AuthAuditLogs | null = await res.json();
    if (raw === null) return [];
    let logs = Object.values(raw).filter(
      (log) => log.action === AuthAuditLogAction.PresentVerificationCode
    );
    return logs as PresentVerificationCodeAuthAuditLog[];
  }

  async getAuthCodeForTarget(target: UserEmail): Promise<AuthCode | null> {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = `/authCodes/${this.targetToFirebasePath(target)}.json`;
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }

    return await res.json();
  }

  async setAuthCodeForTarget(target: UserEmail, code: string, expiry: number) {
    let toWrite: AuthCode = {
      code,
      expiry,
    };

    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = `/authCodes/${this.targetToFirebasePath(target)}.json`;
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
      method: 'PUT',
      body: JSON.stringify(toWrite),
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }
  }

  async deleteAuthCodeForTarget(target: UserEmail) {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = `/authCodes/${this.targetToFirebasePath(target)}.json`;
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }
  }

  async insertSignupForTarget(request: Request, target: UserEmail, info: DBSignupInfo) {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = `/signups.json`;
    let url = urlObj.toString();

    let toWrite: Signup = {
      cancelationTime: null,
      owner: target,
      info,
      ...this.makeBaseAuthAuditLog(request),
    }

    let { headers } = await this.getRequestHeaders();

    let res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(toWrite),
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }
  }

  async getSignupsForTarget(target: UserEmail) {
    let urlObj = new URL(this.baseUrl);
    urlObj.pathname = '/signups.json';
    urlObj.searchParams.set('orderBy', '"owner"');
    urlObj.searchParams.set('equalTo', `"${target}"`);
    let url = urlObj.toString();

    let { headers } = await this.getRequestHeaders();
    let res = await fetch(url, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`firebase: status code is ${res.status}`);
    }

    let raw: Record<string, Signup> = await res.json();
    return raw
  }

  async cancelSignupsForTarget(target: UserEmail) {
    let signups = await this.getSignupsForTarget(target);
    for (let key in signups) {
      if (signups[key].cancelationTime) continue;

      let urlObj = new URL(this.baseUrl);
      urlObj.pathname = `/signups/${key}.json`;
      let url = urlObj.toString();

      let { headers } = await this.getRequestHeaders();

      let delta: Partial<Signup> = {
        cancelationTime: Date.now(),
      }
      let { ok, status } = await fetch(url, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(delta),
      });

      if (!ok) {
        throw new Error(`firebase: status code is ${status}`);
      }
    }
  }
}
