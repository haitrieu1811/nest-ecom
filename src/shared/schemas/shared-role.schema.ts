import z from 'zod'

import { PermissionSchema } from 'src/shared/schemas/shared-permission.schema'

export const RoleSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string('Error.RoleNameIsRequired').max(50, 'Error.RoleNameIsTooLong'),
    description: z.string().max(200, 'Error.RoleDescriptionIsTooLong').default(''),
    isActive: z.boolean().default(true),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.number().int().positive().nullable(),
    updatedById: z.number().int().positive().nullable(),
  })
  .strict()

export const RoleIncludePermissions = RoleSchema.extend({
  permissions: z.array(
    PermissionSchema.pick({
      path: true,
      method: true,
    }),
  ),
})

export type RoleType = z.infer<typeof RoleSchema>
export type RoleIncludePermissionsType = z.infer<typeof RoleIncludePermissions>
