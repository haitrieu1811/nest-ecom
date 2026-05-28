import { z } from 'zod'

import { PermissionSchema } from 'src/shared/schemas/shared-permission.schema'

export const CreatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  description: true,
  path: true,
  method: true,
}).strict()

export const CreatePermissionResSchema = PermissionSchema

export const UpdatePermissionBodySchema = PermissionSchema.pick({
  name: true,
  description: true,
}).strict()

export const UpdatePermissionResSchema = PermissionSchema

export const PermissionIdParamSchema = z
  .object({
    permissionId: z.coerce.number('Error.PermissionIdIsInvalid').positive('Error.PermissionIdIsInvalid'),
  })
  .strict()

export const GetPermissionsResSchema = z
  .object({
    data: z.array(PermissionSchema),
    totalRows: z.number(),
  })
  .strict()

export const GetPermissionResSchema = PermissionSchema

export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>
export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>
export type PermissionIdParamType = z.infer<typeof PermissionIdParamSchema>
export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>
