import { z } from 'zod'
import { Temporal } from '@js-temporal/polyfill'
import parsePhoneNumber from 'libphonenumber-js'

export const ZodUserEmail = z.string().email().endsWith('@mail.yzu.edu.tw')

export enum AuthAuditLogAction {
  SendVerificationCode = 'send_verification_code',
  PresentVerificationCode = 'present_verification_code',
}

export type Env = {
  GRECAPTCHA_SECRET: string
  SMTP_BRIDGE_TOKEN: string
  MAIL_FROM: string
  FIREBASE_RTDB_URL: string
  FIREBASE_SERVICE_ACCOUNT_CREDENTIALS: string
  JWT_SECRET: string
}
export type UserEmail = string

export type RequestMetadata = {
  ip: string
  userAgent: string
}

export type BaseAuthAuditLog = {
  creationTime: number
  requestMetadata: RequestMetadata
}

export type SendVerificationCodeAuthAuditLog = BaseAuthAuditLog & {
  action: AuthAuditLogAction.SendVerificationCode
  target: UserEmail
  success: boolean
  errorMessage?: string
}

export type PresentVerificationCodeAuthAuditLog = BaseAuthAuditLog & {
  action: AuthAuditLogAction.PresentVerificationCode
  target: UserEmail
  success: boolean
}

export type AuthAuditLogs = Record<
  string,
  SendVerificationCodeAuthAuditLog | PresentVerificationCodeAuthAuditLog
>

export type AuthCode = {
  code: string
  expiry: number
}

export type AuthCodes = Record<UserEmail, AuthCode>

export const Sex = z.enum(['male', 'female'], {
  required_error: '必須填寫生理性別',
})
export const FoodPref = z.enum(['meat', 'vegetarian'], {
  required_error: '必須填寫飲食習慣',
})
export const TeeSize = z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'], {
  required_error: '必須填寫營服尺寸',
})

export const SignupInfo = z
  .object({
    personalInfo: z.object({
      name: z.string().trim().min(1, '必須填寫姓名'),
      dept: z.string().trim().min(1, '必須填寫系所'),
      dobYear: z
        .string()
        .trim()
        .min(1, '必須填寫出生年')
        .regex(/^\d+$/, '出生年只能含有數字'),
      dobMonth: z
        .string()
        .trim()
        .min(1, '必須填寫出生月份')
        .regex(/^\d+$/, '出生月份只能含有數字'),
      dobDay: z
        .string()
        .trim()
        .min(1, '必須填寫出生日期')
        .regex(/^\d+$/, '出生日期只能含有數字'),
      phone: z
        .string()
        .trim()
        .min(1, '必須填寫聯絡電話')
        .regex(/^\d+$/, '聯絡電話只能含有數字'),
      sex: Sex,
      foodPref: FoodPref,
      teeSize: TeeSize,
    }),
    emergencyContactInfo: z.object({
      name: z.string().trim().min(1, '必須填寫緊急聯絡人姓名'),
      relation: z.string().trim().min(1, '必須填寫緊急聯絡人關係'),
      phone: z
        .string()
        .trim()
        .min(1, '必須填寫緊急聯絡人電話')
        .regex(/^\d+$/, '緊急聯絡人電話只能含有數字'),
    }),
  })
  .refine(
    ({ personalInfo }) => {
      let { dobDay, dobMonth, dobYear } = personalInfo
      let day = Number(dobDay)
      let month = Number(dobMonth)
      let year = Number(dobYear)

      try {
        Temporal.PlainDate.from({ day, month, year }, { overflow: 'reject' })
        return true
      } catch (e) {
        return false
      }
    },
    ({ personalInfo }) => {
      let { dobDay, dobMonth, dobYear } = personalInfo
      let fb = (n: string) => (Number.isNaN(Number(n)) ? n : Number(n))
      let day = fb(dobDay)
      let month = fb(dobMonth)
      let year = fb(dobYear)
      return {
        message: `${year}/${month}/${day} 不是正確的日期`,
      }
    }
  )
  .refine(
    ({ personalInfo }) => {
      return parsePhoneNumber(personalInfo.phone, 'TW')?.isValid() === true
    },
    ({ personalInfo }) => ({
      message: `聯絡電話 ${personalInfo.phone} 不是正確的電話號碼`,
    })
  )
  .refine(
    ({ emergencyContactInfo }) => {
      return (
        parsePhoneNumber(emergencyContactInfo.phone, 'TW')?.isValid() === true
      )
    },
    ({ emergencyContactInfo }) => ({
      message: `緊急聯絡人電話 ${emergencyContactInfo.phone} 不是正確的電話號碼`,
    })
  )

export type DBSignupInfo = {
  personalInfo: {
    name: string
    dept: string
    dobYear: number
    dobMonth: number
    dobDay: number
    phone: string
    sex: z.infer<typeof Sex>
    foodPref: z.infer<typeof FoodPref>
    teeSize: z.infer<typeof TeeSize>
  }
  emergencyContactInfo: {
    name: string
    relation: string
    phone: string
  }
}

export type Signup = {
  creationTime: number
  cancelationTime: number | null
  owner: UserEmail
  info: DBSignupInfo
  requestMetadata: RequestMetadata
}
