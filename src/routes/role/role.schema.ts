import z from 'zod'

import { PaginationResSchema } from 'src/shared/schemas/response.schema'
import { RoleIncludePermissions, RoleSchema } from 'src/shared/schemas/shared-role.schema'

export const CreateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
}).strict()

export const CreateRoleResSchema = RoleSchema

export const GetRolesResSchema = z.object({
  data: z.array(RoleSchema),
  pagination: PaginationResSchema,
})

export const GetRoleResSchema = RoleIncludePermissions

export const UpdateRoleBodySchema = RoleSchema.pick({
  name: true,
  description: true,
  isActive: true,
})
  .extend({
    permissionIds: z.array(
      z
        .number('Error.PermissionIdIsInvalid')
        .int('Error.PermissionIdIsInvalid')
        .positive('Error.PermissionIdIsInvalid'),
    ),
  })
  .strict()

export const UpdateRoleResSchema = RoleIncludePermissions

export const RoleIdParamSchema = z
  .object({
    roleId: z.coerce.number().int().positive(),
  })
  .strict()

export type CreateRoleBodyType = z.infer<typeof CreateRoleBodySchema>
export type CreateRoleResType = z.infer<typeof CreateRoleResSchema>
export type GetRolesResType = z.infer<typeof GetRolesResSchema>
export type GetRoleResType = z.infer<typeof GetRoleResSchema>
export type UpdateRoleBodyType = z.infer<typeof UpdateRoleBodySchema>
export type UpdateRoleResType = z.infer<typeof UpdateRoleResSchema>
export type RoleIdParamType = z.infer<typeof RoleIdParamSchema>
