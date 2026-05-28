import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreatePermissionBodyDTO,
  CreatePermissionResDTO,
  GetPermissionResDTO,
  GetPermissionsResDTO,
  PermissionIdParamDTO,
  UpdatePermissionBodyDTO,
  UpdatePermissionResDTO,
} from 'src/routes/permission/permission.dto'
import { PermissionService } from 'src/routes/permission/permission.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ZodResponse({ type: CreatePermissionResDTO })
  createPermission(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.createPermission({ body, userId })
  }

  @Get()
  @ZodResponse({ type: GetPermissionsResDTO })
  getPermissions() {
    return this.permissionService.getPermissions()
  }

  @Get(':permissionId')
  @ZodResponse({ type: GetPermissionResDTO })
  getPermission(@Param() param: PermissionIdParamDTO) {
    return this.permissionService.getPermission(param.permissionId)
  }

  @Put(':permissionId')
  @ZodResponse({ type: UpdatePermissionResDTO })
  updatePermission(
    @Param() param: PermissionIdParamDTO,
    @Body() body: UpdatePermissionBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.updatePermission({
      body,
      permissionId: param.permissionId,
      userId,
    })
  }

  @Delete(':permissionId')
  @ZodResponse({ type: MessageResDTO })
  deletePermission(@Param() param: PermissionIdParamDTO) {
    return this.permissionService.deletePermission(param.permissionId)
  }
}
