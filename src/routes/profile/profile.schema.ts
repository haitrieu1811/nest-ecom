import z from 'zod'

import { RoleIncludePermissions } from 'src/shared/schemas/shared-role.schema'
import { UserSchema } from 'src/shared/schemas/shared-user.schema'

export const ProfileSchema = UserSchema.pick({
  id: true,
  email: true,
  name: true,
  phoneNumber: true,
  avatar: true,
  status: true,
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

export type ProfileType = z.infer<typeof ProfileSchema>
export type GetProfileResType = z.infer<typeof GetProfileResSchema>
export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>
export type UpdateProfileResType = z.infer<typeof UpdateProfileResSchema>
