import z from 'zod'

import { PHONE_NUMBER_REGEX } from 'src/shared/constants/regex'
import { UserStatus } from 'src/shared/constants/auth.constant'
import { RoleIncludePermissions } from 'src/shared/schemas/shared-role.schema'

export const emailSchema = z.email('Error.EmailIsInvalid')

export const UserSchema = z
  .object({
    id: z.int().positive(),
    email: emailSchema,
    password: z.string('Error.PasswordMustBeAString').min(12, 'Error.PasswordIsTooShort').max(32, 'PasswordIsTooLong'),
    name: z.string('Error.UserNameMustBeAString').max(100, 'Error.UserNameIsTooLong').nullable(),
    phoneNumber: z
      .string('Error.PhoneNumberMustBeAString')
      .max(11, 'Error.PhoneNumberIsTooLong')
      .regex(PHONE_NUMBER_REGEX, 'Error.PhoneNumberIsInvalid')
      .nullable(),
    avatar: z.string('Error.AvatarMustBeAString').nullable(),
    totpSecret: z.string().nullable(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED], 'Error.UserStatusIsInvalid'),
    roleId: z.coerce
      .number('Error.RoleIdMustBeANumber')
      .int('Error.RoleIdMustBeAInt')
      .positive('Error.RoleIdMustBePositive'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict()

export const UserIncludeRolePermissionsSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleIncludePermissions,
})

export type UserType = z.infer<typeof UserSchema>
export type UserIncludeRolePermissionsType = z.infer<typeof UserIncludeRolePermissionsSchema>
