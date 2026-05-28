import z from 'zod'

import { HTTP_METHOD } from 'src/shared/constants/permission.constant'

export const PermissionSchema = z
  .object({
    id: z.number().positive(),
    name: z.string('Error.PermissionNameIsRequired').max(200, 'Error.PermissionNameIsTooLong'),
    description: z
      .string('Error.PermissionDescriptionIsRequired')
      .max(200, 'Error.PermissionDescriptionIsTooLong')
      .optional(),
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
    module: z.string('Error.PermissionModuleIsRequired').max(50, 'Error.PermissionModuleIsTooLong'),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.number().positive().nullable(),
    updatedById: z.number().positive().nullable(),
  })
  .strict()

export type PermissionType = z.infer<typeof PermissionSchema>
