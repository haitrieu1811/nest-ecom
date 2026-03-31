import { createZodDto } from 'nestjs-zod'

import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetUserResSchema,
  GetUsersResSchema,
  UpdateUserBodySchema,
  UpdateUserResSchema,
  UserIdParamSchema,
} from 'src/routes/user/user.schema'

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}
export class CreateUserResDTO extends createZodDto(CreateUserResSchema) {}
export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}
export class UpdateUserResDTO extends createZodDto(UpdateUserResSchema) {}
export class GetUsersResDTO extends createZodDto(GetUsersResSchema) {}
export class GetUserResDTO extends createZodDto(GetUserResSchema) {}
export class UserIdParamDTO extends createZodDto(UserIdParamSchema) {}
