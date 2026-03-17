import { z } from 'zod'

import { HTTP_METHOD } from 'src/shared/constants/permission.constant'
import { PaginationResType } from 'src/shared/schemas/response.schema'

export const PermissionSchema = z
  .object({
    id: z.number().positive(),
    name: z.string('Error.PermissionNameIsRequired').max(50, 'Error.PermissionNameIsTooLong'),
    description: z
      .string('Error.PermissionDescriptionIsRequired')
      .max(200, 'Error.PermissionDescriptionIsTooLong')
      .optional()
      .default(''),
    path: z.string('Error.PermissionPathIsRequired').max(100, 'Error.PermissionPathIsTooLong'),
    method: z.enum(
      [
        HTTP_METHOD.GET,
        HTTP_METHOD.POST,
        HTTP_METHOD.PUT,
        HTTP_METHOD.DELETE,
        HTTP_METHOD.PATCH,
        HTTP_METHOD.OPTIONS,
        HTTP_METHOD.HEAD,
      ],
      'Error.InvalidPermissionMethod',
    ),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.number().positive().nullable(),
    updatedById: z.number().positive().nullable(),
  })
  .strict()

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
  path: true,
  method: true,
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
    pagination: PaginationResType,
  })
  .strict()

export const GetPermissionResSchema = PermissionSchema

export type PermissionType = z.infer<typeof PermissionSchema>
export type CreatePermissionBodyType = z.infer<typeof CreatePermissionBodySchema>
export type CreatePermissionResType = z.infer<typeof CreatePermissionResSchema>
export type UpdatePermissionBodyType = z.infer<typeof UpdatePermissionBodySchema>
export type UpdatePermissionResType = z.infer<typeof UpdatePermissionResSchema>
export type PermissionIdParamType = z.infer<typeof PermissionIdParamSchema>
export type GetPermissionsResType = z.infer<typeof GetPermissionsResSchema>
export type GetPermissionResType = z.infer<typeof GetPermissionResSchema>
