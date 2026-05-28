import z from 'zod'

import { PermissionSchema } from 'src/shared/schemas/shared-permission.schema'

export const RoleSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string('Error.RoleNameIsRequired').min(1, 'Error.RoleNameIsRequired').max(50, 'Error.RoleNameIsTooLong'),
    description: z.string().max(200, 'Error.RoleDescriptionIsTooLong').optional(),
    isActive: z.boolean().optional(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.number().int().positive().nullable(),
    updatedById: z.number().int().positive().nullable(),
  })
  .strict()

export const RoleIncludeCountSchema = RoleSchema.extend({
  _count: z.object({
    users: z.number(),
  }),
})

export const PermissionInRoleSchema = PermissionSchema.pick({
  id: true,
  module: true,
  path: true,
  method: true,
  name: true,
  description: true,
})

export const RoleIncludePermissions = RoleSchema.extend({
  permissions: z.array(PermissionInRoleSchema),
})

export type RoleType = z.infer<typeof RoleSchema>
export type RoleIncludeCountType = z.infer<typeof RoleIncludeCountSchema>
export type PermissionInRoleType = z.infer<typeof PermissionInRoleSchema>
export type RoleIncludePermissionsType = z.infer<typeof RoleIncludePermissions>
