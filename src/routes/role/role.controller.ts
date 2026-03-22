import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateRoleBodyDTO,
  CreateRoleResDTO,
  GetRoleResDTO,
  GetRolesResDTO,
  RoleIdParamDTO,
  UpdateRoleBodyDTO,
  UpdateRoleResDTO,
} from 'src/routes/role/role.dto'
import { RoleService } from 'src/routes/role/role.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ZodResponse({ type: CreateRoleResDTO })
  createRole(@Body() body: CreateRoleBodyDTO, @ActiveUser('userId') userId: number) {
    return this.roleService.createRole({ body, userId })
  }

  @Put(':roleId')
  @ZodResponse({ type: UpdateRoleResDTO })
  updateRole(@Body() body: UpdateRoleBodyDTO, @ActiveUser('userId') userId: number, @Param() param: RoleIdParamDTO) {
    return this.roleService.updateRole({ body, userId, roleId: param.roleId })
  }

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetRolesResDTO })
  getRoles(@Query() query: PaginationQueryDTO) {
    return this.roleService.getRoles(query)
  }

  @Get(':roleId')
  @IsPublic()
  @ZodResponse({ type: GetRoleResDTO })
  getRole(@Param() param: RoleIdParamDTO) {
    return this.roleService.getRole(param.roleId)
  }

  @Delete(':roleId')
  @ZodResponse({ type: MessageResDTO })
  deleteRole(@Param() param: RoleIdParamDTO) {
    return this.roleService.deleteRole(param.roleId)
  }
}
