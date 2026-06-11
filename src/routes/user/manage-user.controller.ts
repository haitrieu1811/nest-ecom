import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { ManageUserService } from 'src/routes/user/manage-user.service'

import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  GetListUsersQueryDTO,
  GetListUsersResDTO,
  GetUserDetailResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
  UserIdParamDTO,
} from 'src/routes/user/user.dto'
import type { RoleNameType } from 'src/shared/constants/role.constant'
import ActiveRole from 'src/shared/decorators/active-role.decorator'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('manage-user')
export class ManageUserController {
  constructor(private readonly manageUserService: ManageUserService) {}

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  createUser(
    @Body() body: CreateUserBodyDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRole('name') roleName: RoleNameType,
  ) {
    return this.manageUserService.createUser({
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
    return this.manageUserService.updateUser({
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
    return this.manageUserService.deleteUser({
      userId: param.userId,
      deletedById: userId,
      roleNameAgent: roleName,
    })
  }

  @Get()
  @ZodResponse({ type: GetListUsersResDTO })
  getUsers(@Query() query: GetListUsersQueryDTO) {
    return this.manageUserService.getUsers(query)
  }

  @Get(':userId')
  @ZodResponse({ type: GetUserDetailResDTO })
  getUser(@Param() param: UserIdParamDTO) {
    return this.manageUserService.getUser(param.userId)
  }
}
