import z from 'zod'

import { PHONE_NUMBER_REGEX } from 'src/shared/constants/regex'
import { UserStatus } from 'src/shared/constants/auth.constant'

export const emailSchema = z.email('Email không hợp lệ.')

export const UserSchema = z
  .object({
    id: z.int().positive(),
    email: emailSchema,
    password: z
      .string('Mật khẩu là bắt buộc.')
      .min(8, 'Mật khẩu phải có độ dài tối thiểu 8 ký tự.')
      .max(32, 'Mật khẩu phải có độ dài tối đa 32 ký tự.'),
    name: z.string().max(100, 'Tên chỉ có độ dài tối đa 100 ký tự.').nullable(),
    phoneNumber: z
      .string()
      .max(11, 'Số điện thoại chỉ có độ dài tối đa 11 ký tự.')
      .regex(PHONE_NUMBER_REGEX, 'Số điện thoại không hợp lệ.')
      .nullable(),
    avatar: z.string().nullable(),
    totpSecret: z.string().nullable(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
    roleId: z.int().positive(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict()

export type UserType = z.infer<typeof UserSchema>
