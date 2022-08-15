import { z } from 'zod';

export const ZodUserEmail = z.string().email().endsWith('@mail.yzu.edu.tw');

export enum AuthAuditLogAction {
  SendVerificationCode = 'send_verification_code',
  PresentVerificationCode = 'present_verification_code',
}

export type Env = {
  GRECAPTCHA_SECRET: string;
  SMTP_BRIDGE_TOKEN: string;
  MAIL_FROM: string;
  FIREBASE_RTDB_URL: string;
  FIREBASE_SERVICE_ACCOUNT_CREDENTIALS: string;
  JWT_SECRET: string;
};
export type UserEmail = string;

export type BaseAuthAuditLog = {
  creationTime: number;
  requestMetadata: {
    ip: string;
    userAgent: string;
  };
};

export type SendVerificationCodeAuthAuditLog = BaseAuthAuditLog & {
  action: AuthAuditLogAction.SendVerificationCode;
  target: UserEmail;
  success: boolean;
  errorMessage?: string;
};

export type PresentVerificationCodeAuthAuditLog = BaseAuthAuditLog & {
  action: AuthAuditLogAction.PresentVerificationCode;
  target: UserEmail;
  success: boolean;
};

export type AuthAuditLogs = Record<
  string,
  SendVerificationCodeAuthAuditLog | PresentVerificationCodeAuthAuditLog
>;

export type AuthCode = {
  code: string;
  expiry: number;
};

export type AuthCodes = Record<UserEmail, AuthCode>;
