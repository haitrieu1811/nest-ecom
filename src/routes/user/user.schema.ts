import z from 'zod'

import { UserSchema } from 'src/shared/schemas/shared-user.schema'
import { RoleIncludePermissions } from 'src/shared/schemas/shared-role.schema'
import { PaginationResSchema } from 'src/shared/schemas/response.schema'

export const UserIncludeRolePermissionsSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
}).extend({
  role: RoleIncludePermissions,
})

export const CreateUserBodySchema = UserSchema.pick({
  email: true,
  password: true,
  name: true,
  avatar: true,
  status: true,
  roleId: true,
  phoneNumber: true,
}).strict()

export const CreateUserResSchema = UserSchema.omit({
  password: true,
  totpSecret: true,
})

export const UpdateUserBodySchema = CreateUserBodySchema.omit({
  email: true,
})

export const UpdateUserResSchema = UserIncludeRolePermissionsSchema

export const GetUsersResSchema = z.object({
  data: z.array(UserIncludeRolePermissionsSchema),
  pagination: PaginationResSchema,
})

export const GetUserResSchema = UserIncludeRolePermissionsSchema

export type UserIncludeRolePermissionsType = z.infer<typeof UserIncludeRolePermissionsSchema>
export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type CreateUserResType = z.infer<typeof CreateUserResSchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetUserResType = z.infer<typeof GetUserResSchema>
