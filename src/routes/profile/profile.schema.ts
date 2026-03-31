import z from 'zod'

import { RoleIncludePermissions } from 'src/shared/schemas/shared-role.schema'
import { UserSchema } from 'src/shared/schemas/shared-user.schema'

export const ProfileSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleIncludePermissions,
})

export const GetProfileResSchema = ProfileSchema

export const UpdateProfileBodySchema = ProfileSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
}).strict()

export const UpdateProfileResSchema = ProfileSchema

export const ChangePasswordBodySchema = UserSchema.pick({
  password: true,
})
  .extend({
    oldPassword: z.string('Error.OldPasswordMustBeAString'),
    confirmPassword: z.string('Error.ConfirmPasswordMustBeAString'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Error.ConfirmPasswordDoesNotMatch',
      })
    }
  })

export type ProfileType = z.infer<typeof ProfileSchema>
export type GetProfileResType = z.infer<typeof GetProfileResSchema>
export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
