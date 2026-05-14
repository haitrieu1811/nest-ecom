import z from 'zod'

import { UserIncludeRolePermissionsSchema, UserSchema } from 'src/shared/schemas/shared-user.schema'

export const GetProfileResSchema = UserIncludeRolePermissionsSchema

export const UpdateProfileBodySchema = UserSchema.pick({
  name: true,
  phoneNumber: true,
  avatar: true,
}).strict()

export const UpdateProfileResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export const ChangePasswordBodySchema = UserSchema.pick({
  password: true,
})
  .extend({
    oldPassword: z.string('Error.OldPasswordMustBeAString').min(1, 'Error.OldPasswordRequired'),
    confirmPassword: z.string('Error.ConfirmPasswordMustBeAString').min(1, 'Error.ConfirmPasswordRequired'),
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

export type ProfileType = z.infer<typeof UserIncludeRolePermissionsSchema>
export type GetProfileResType = z.infer<typeof GetProfileResSchema>
export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>
export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
