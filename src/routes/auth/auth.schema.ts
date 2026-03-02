import z from 'zod'

import { UserStatus } from 'src/shared/constants/enum'

export const RegisterBodySchema = z
  .object({
    email: z.email('Email không hợp lệ.'),
    password: z
      .string('Mật khẩu là bắt buộc.')
      .min(8, 'Mật khẩu phải có độ dài tối thiểu 8 ký tự.')
      .max(32, 'Mật khẩu phải có độ dài tối đa 32 ký tự.'),
    confirmPassword: z.string('Nhập lại mật khẩu là bắt buộc.'),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        message: 'Nhập lại mật khẩu không chính xác.',
        code: 'custom',
        path: ['confirmPassword'],
      })
    }
  })

export const RegisterResSchema = z
  .object({
    id: z.int(),
    email: z.email(),
    name: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    avatar: z.string().nullable(),
    roleId: z.int(),
    status: z.enum([UserStatus.ACTIVE.toString(), UserStatus.BLOCKED.toString()]),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict()

export type RegisterBodyType = z.infer<typeof RegisterBodySchema>
export type RegisterResType = z.infer<typeof RegisterResSchema>
