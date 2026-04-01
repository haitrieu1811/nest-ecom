import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserResDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
  UserIdParamDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  createUser(@Body() body: CreateUserBodyDTO, @ActiveUser('userId') userId: number) {
    return this.userService.createUser({
      body,
      createdById: userId,
    })
  }

  @Put(':userId')
  @ZodResponse({ type: UpdateUserResDTO })
  updateUser(@Body() body: UpdateUserBodyDTO, @ActiveUser('userId') userId: number, @Param() param: UserIdParamDTO) {
    return this.userService.updateUser({
      body,
      updatedById: userId,
      userId: param.userId,
    })
  }

  @Delete(':userId')
  @ZodResponse({ type: MessageResDTO })
  deleteUser(
    @ActiveUser('userId') userId: number,
    @ActiveUser('roleId') roleId: number,
    @Param() param: UserIdParamDTO,
  ) {
    return this.userService.deleteUser({
      userId: param.userId,
      deletedById: userId,
      deletedByRoleId: roleId,
    })
  }

  @Get()
  @ZodResponse({ type: GetUsersResDTO })
  getUsers(@Query() query: PaginationQueryDTO) {
    return this.userService.getUsers(query)
  }

  @Get(':userId')
  @ZodResponse({ type: GetUserResDTO })
  getUser(@Param() param: UserIdParamDTO) {
    return this.userService.getUser(param.userId)
  }
}
