import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  GetListSellersResDTO,
  GetListUsersQueryDTO,
  GetSellerDetailResDTO,
  UserIdParamDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('users')
@IsPublic()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('sellers')
  @ZodResponse({ type: GetListSellersResDTO })
  getListSellers(@Query() query: GetListUsersQueryDTO) {
    return this.userService.getListSellers(query)
  }

  @Get('sellers/:userId')
  @ZodResponse({ type: GetSellerDetailResDTO })
  getSellerDetail(@Param() param: UserIdParamDTO) {
    return this.userService.getSellerDetail(param.userId)
  }
}
