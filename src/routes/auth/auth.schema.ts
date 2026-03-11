import z from 'zod'

import { emailSchema, UserSchema } from 'src/shared/schemas/shared-user.schema'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'

const otpCodeSchema = z.string('OTP là bắt buộc.').length(6, 'OTP phải có độ dài 6 ký tự.')
const confirmPasswordSchema = z.string('Nhập lại mật khẩu là bắt buộc.')

export const TokensResSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const DeviceSchema = z
  .object({
    id: z.int().positive(),
    userId: z.int().positive(),
    userAgent: z.string(),
    ip: z.string(),
    isActive: z.boolean().default(true),
    lastActive: z.iso.datetime(),
    createdAt: z.iso.datetime(),
  })
  .strict()

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    confirmPassword: confirmPasswordSchema,
    code: otpCodeSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: 'Nhập lại mật khẩu không chính xác.',
        code: 'custom',
        path: ['confirmPassword'],
      })
    }
  })
  .strict()

export const RegisterResSchema = TokensResSchema.extend({
  user: UserSchema.omit({
    password: true,
    totpSecret: true,
    deletedAt: true,
    createdById: true,
    updatedById: true,
  }).strict(),
}).strict()

export const VerificationCodeSchema = z
  .object({
    id: z.int(),
    email: emailSchema,
    code: otpCodeSchema,
    type: z.enum(
      [VerificationCodeType.REGISTER, VerificationCodeType.FORGOT_PASSWORD],
      'Verification code type không hợp lệ.',
    ),
    expiresAt: z.iso.datetime(),
    createdAt: z.iso.datetime(),
  })
  .strict()

export const SendOTPBodySchema = VerificationCodeSchema.pick({
  email: true,
  type: true,
}).strict()

export const LoginBodySchema = UserSchema.pick({
  email: true,
  password: true,
}).strict()

export const LoginResSchema = RegisterResSchema

export const RefreshTokenBodySchema = z
  .object({
    refreshToken: z.string('Refresh token là bắt buộc.'),
  })
  .strict()

export const LogoutBodySchema = RefreshTokenBodySchema.pick({
  refreshToken: true,
})

export const GoogleOAuthLinkStateSchema = DeviceSchema.pick({
  userAgent: true,
  ip: true,
})

export const GetGoogleOAuthLinkResSchema = z.object({
  url: z.url(),
})

export const ResetPasswordBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    confirmPassword: confirmPasswordSchema,
    code: otpCodeSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Nhập lại mật khẩu không chính xác.',
        path: ['confirmPassword'],
      })
    }
  })
  .strict()

export const ResetPasswordResSchema = LoginResSchema

export type DeviceType = z.infer<typeof DeviceSchema>
export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerificationCode = z.infer<typeof VerificationCodeSchema>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
export type LoginBodyType = z.infer<typeof LoginBodySchema>
export type LoginResTyoe = z.infer<typeof LoginResSchema>
export type RefreshTokenBodyType = z.infer<typeof RefreshTokenBodySchema>
export type RefreshTokenResType = z.infer<typeof TokensResSchema>
export type TokensResType = z.infer<typeof TokensResSchema>
export type LogoutBodyType = z.infer<typeof LogoutBodySchema>
export type GoogleOAuthLinkStateType = z.infer<typeof GoogleOAuthLinkStateSchema>
export type GetGoogleOAuthLinkResType = z.infer<typeof GetGoogleOAuthLinkResSchema>
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBodySchema>
export type ResetPasswordResType = z.infer<typeof ResetPasswordResSchema>
