import z from 'zod'

import { PaginationResSchema } from 'src/shared/schemas/response.schema'
import { UserIncludeRolePermissionsSchema, UserSchema } from 'src/shared/schemas/shared-user.schema'

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

export const UpdateUserBodySchema = CreateUserBodySchema

export const UpdateUserResSchema = UserIncludeRolePermissionsSchema

export const GetUsersResSchema = z.object({
  data: z.array(UserIncludeRolePermissionsSchema),
  pagination: PaginationResSchema,
})

export const GetUserResSchema = UserIncludeRolePermissionsSchema

export const UserIdParamSchema = z
  .object({
    userId: z.coerce.number().int('Error.UserIdMustBeAnInt').positive('Error.UserIdMustBePositive'),
  })
  .strict()

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type CreateUserResType = z.infer<typeof CreateUserResSchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetUserResType = z.infer<typeof GetUserResSchema>
export type UserIdParamType = z.infer<typeof UserIdParamSchema>
