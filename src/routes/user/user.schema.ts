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

export const GetListUsersQuerySchema = PaginationQuerySchema.extend({
  email: z.string('Error.InvalidEmail').optional(),
})

export const GetListUsersResSchema = z.object({
  data: z.array(
    UserIncludeRoleSchema.omit({
      password: true,
      totpSecret: true,
    }),
  ),
  pagination: PaginationResSchema,
})

export const GetUserDetailResSchema = UserIncludeRolePermissionsSchema

export const SellerSchema = UserSchema.pick({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  avatar: true,
})

export const GetListSellersResSchema = z.object({
  data: z.array(SellerSchema),
  pagination: PaginationResSchema,
})

export const GetSellerDetailResSchema = SellerSchema

export const UserIdParamSchema = z
  .object({
    userId: z.coerce.number().int('Error.UserIdMustBeAnInt').positive('Error.UserIdMustBePositive'),
  })
  .strict()

export type CreateUserBodyType = z.infer<typeof CreateUserBodySchema>
export type CreateUserResType = z.infer<typeof CreateUserResSchema>
export type UpdateUserBodyType = z.infer<typeof UpdateUserBodySchema>
export type UpdateUserResType = z.infer<typeof UpdateUserResSchema>
export type GetListUsersQueryType = z.infer<typeof GetListUsersQuerySchema>
export type GetListUsersResType = z.infer<typeof GetListUsersResSchema>
export type SellerType = z.infer<typeof SellerSchema>
export type GetListSellersResType = z.infer<typeof GetListSellersResSchema>
export type GetUserDetailResType = z.infer<typeof GetUserDetailResSchema>
export type GetSellerDetailResType = z.infer<typeof GetSellerDetailResSchema>
export type UserIdParamType = z.infer<typeof UserIdParamSchema>
