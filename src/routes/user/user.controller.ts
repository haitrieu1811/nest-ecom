import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetUserResDTO,
  GetUsersQueryDTO,
  GetUsersResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
  UserIdParamDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import type { RoleNameType } from 'src/shared/constants/role.constant'
import ActiveRole from 'src/shared/decorators/active-role.decorator'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  createUser(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRole('name') roleName: RoleNameType,
  ) {
    return this.userService.createUser({
      body,
      createdById: userId,
      roleNameAgent: roleName,
    })
  }

  @Put(':userId')
  @ZodResponse({ type: UpdateUserResDTO })
  updateUser(
    @Body() body: UpdateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @Param() param: UserIdParamDTO,
    @ActiveRole('name') roleName: RoleNameType,
  ) {
    return this.userService.updateUser({
      body,
      updatedById: userId,
      userId: param.userId,
      roleNameAgent: roleName,
    })
  }

  @Delete(':userId')
  @ZodResponse({ type: MessageResDTO })
  deleteUser(
    @ActiveUser('userId') userId: number,
    @ActiveRole('name') roleName: RoleNameType,
    @Param() param: UserIdParamDTO,
  ) {
    return this.userService.deleteUser({
      userId: param.userId,
      deletedById: userId,
      roleNameAgent: roleName,
    })
  }

  @Get()
  @ZodResponse({ type: GetUsersResDTO })
  getUsers(@Query() query: GetUsersQueryDTO) {
    return this.userService.getUsers(query)
  }

  @Get(':userId')
  @ZodResponse({ type: GetUserResDTO })
  getUser(@Param() param: UserIdParamDTO) {
    return this.userService.getUser(param.userId)
  }
}
