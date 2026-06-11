import { createZodDto } from 'nestjs-zod'

import {
  CreateUserBodySchema,
  CreateUserResSchema,
  GetListSellersResSchema,
  GetListUsersQuerySchema,
  GetListUsersResSchema,
  GetSellerDetailResSchema,
  GetUserDetailResSchema,
  UpdateUserBodySchema,
  UpdateUserResSchema,
  UserIdParamSchema,
} from 'src/routes/user/user.schema'

export class CreateUserBodyDTO extends createZodDto(CreateUserBodySchema) {}
export class CreateUserResDTO extends createZodDto(CreateUserResSchema) {}
export class UpdateUserBodyDTO extends createZodDto(UpdateUserBodySchema) {}
export class UpdateUserResDTO extends createZodDto(UpdateUserResSchema) {}
export class UserIdParamDTO extends createZodDto(UserIdParamSchema) {}
export class GetListUsersQueryDTO extends createZodDto(GetListUsersQuerySchema) {}
export class GetListUsersResDTO extends createZodDto(GetListUsersResSchema) {}
export class GetUserDetailResDTO extends createZodDto(GetUserDetailResSchema) {}
export class GetListSellersResDTO extends createZodDto(GetListSellersResSchema) {}
export class GetSellerDetailResDTO extends createZodDto(GetSellerDetailResSchema) {}
