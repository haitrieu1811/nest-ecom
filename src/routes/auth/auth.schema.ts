import z from 'zod'

import { emailSchema, UserSchema } from 'src/shared/schemas/shared-user.schema'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'

const otpCodeSchema = z.string('OTP là bắt buộc.').length(6, 'OTP phải có độ dài 6 ký tự.')

export const RegisterBodySchema = UserSchema.pick({
  email: true,
  password: true,
})
  .extend({
    confirmPassword: z.string('Nhập lại mật khẩu là bắt buộc.'),
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

export const RegisterResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
  deletedAt: true,
  createdById: true,
  updatedById: true,
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

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
export type VerificationCode = z.infer<typeof VerificationCodeSchema>
export type SendOTPBodyType = z.infer<typeof SendOTPBodySchema>
