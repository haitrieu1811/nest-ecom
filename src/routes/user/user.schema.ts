import z from 'zod'

import { PaginationResSchema } from 'src/shared/schemas/response.schema'
import {
  UserIncludeRolePermissionsSchema,
  UserIncludeRoleSchema,
  UserSchema,
} from 'src/shared/schemas/shared-user.schema'
import { PaginationQuerySchema } from 'src/shared/schemas/request.shema'

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

export const GetUsersQuerySchema = PaginationQuerySchema.extend({
  email: z.string('Error.InvalidEmail').optional(),
})

export const GetUsersResSchema = z.object({
  data: z.array(
    UserIncludeRoleSchema.omit({
      password: true,
      totpSecret: true,
    }),
  ),
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
export type GetUsersQueryType = z.infer<typeof GetUsersQuerySchema>
export type GetUsersResType = z.infer<typeof GetUsersResSchema>
export type GetUserResType = z.infer<typeof GetUserResSchema>
export type UserIdParamType = z.infer<typeof UserIdParamSchema>
