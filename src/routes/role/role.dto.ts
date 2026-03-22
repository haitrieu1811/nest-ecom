import { createZodDto } from 'nestjs-zod'

import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  GetRoleResSchema,
  GetRolesResSchema,
  RoleIdParamSchema,
  UpdateRoleBodySchema,
  UpdateRoleResSchema,
} from 'src/routes/role/role.schema'

export class CreateRoleBodyDTO extends createZodDto(CreateRoleBodySchema) {}
export class CreateRoleResDTO extends createZodDto(CreateRoleResSchema) {}
export class GetRolesResDTO extends createZodDto(GetRolesResSchema) {}
export class GetRoleResDTO extends createZodDto(GetRoleResSchema) {}
export class UpdateRoleBodyDTO extends createZodDto(UpdateRoleBodySchema) {}
export class UpdateRoleResDTO extends createZodDto(UpdateRoleResSchema) {}
export class RoleIdParamDTO extends createZodDto(RoleIdParamSchema) {}
