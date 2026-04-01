import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateUserBodyDTO,
  CreateUserResDTO,
  UpdateUserBodyDTO,
  UpdateUserResDTO,
  UserIdParamDTO,
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
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
}
