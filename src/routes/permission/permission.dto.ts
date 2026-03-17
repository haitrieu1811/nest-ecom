import { createZodDto } from 'nestjs-zod'

import {
  CreatePermissionBodySchema,
  CreatePermissionResSchema,
  GetPermissionResSchema,
  GetPermissionsResSchema,
  PermissionIdParamSchema,
  UpdatePermissionBodySchema,
  UpdatePermissionResSchema,
} from 'src/routes/permission/permission.schema'

export class CreatePermissionBodyDTO extends createZodDto(CreatePermissionBodySchema) {}
export class CreatePermissionResDTO extends createZodDto(CreatePermissionResSchema) {}
export class UpdatePermissionBodyDTO extends createZodDto(UpdatePermissionBodySchema) {}
export class UpdatePermissionResDTO extends createZodDto(UpdatePermissionResSchema) {}
export class PermissionIdParamDTO extends createZodDto(PermissionIdParamSchema) {}
export class GetPermissionsResDTO extends createZodDto(GetPermissionsResSchema) {}
export class GetPermissionResDTO extends createZodDto(GetPermissionResSchema) {}
