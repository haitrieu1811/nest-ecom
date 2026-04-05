import { Injectable } from '@nestjs/common'

import { ProhibitedActionOnBaseRoleException, RoleAlreadyExistException } from 'src/routes/role/role.error'
import { RoleRepo } from 'src/routes/role/role.repo'
import {
  CreateRoleBodyType,
  CreateRoleResType,
  GetRoleResType,
  GetRolesResType,
  UpdateRoleBodyType,
  UpdateRoleResType,
} from 'src/routes/role/role.schema'
import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { PermissionNotFoundException, RoleNotFoundException } from 'src/shared/error'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'
import { RoleIncludePermissionsType } from 'src/shared/schemas/shared-role.schema'

@Injectable()
export class RoleService {
  baseRoles: string[]

  constructor(private readonly roleRepo: RoleRepo) {
    this.baseRoles = [ROLE_NAME.ADMIN, ROLE_NAME.SELLER, ROLE_NAME.CLIENT, ROLE_NAME.MANAGER]
  }

  private async handlePreventActionsOnBaseRoles(roleId: number): Promise<RoleIncludePermissionsType> {
    const role = await this.roleRepo.findUnique({
      id: roleId,
    })
    if (!role) {
      throw RoleNotFoundException
    }
    if (this.baseRoles.includes(role.name)) {
      throw ProhibitedActionOnBaseRoleException
    }
    return role
  }

  async createRole({ body, userId }: { body: CreateRoleBodyType; userId: number }): Promise<CreateRoleResType> {
    try {
      const result = await this.roleRepo.create({
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistException
      }
      throw error
    }
  }

  async updateRole({
    body,
    userId,
    roleId,
  }: {
    body: UpdateRoleBodyType
    userId: number
    roleId: number
  }): Promise<UpdateRoleResType> {
    try {
      // Không cho phép bất cứ ai cập nhật base role (Admin, Seller, Client)
      await this.handlePreventActionsOnBaseRoles(roleId)
      const updatedRole = await this.roleRepo.update({
        where: {
          id: roleId,
        },
        data: body,
        userId,
      })
      return updatedRole
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistException
      }
      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException
      }
      throw error
    }
  }

  async getRoles(query: PaginationQueryType): Promise<GetRolesResType> {
    const { roles, totalRoles } = await this.roleRepo.findMany(query)
    return {
      data: roles,
      pagination: {
        ...query,
        totalRows: totalRoles,
        totalPages: Math.ceil(totalRoles / query.limit),
      },
    }
  }

  async getRole(roleId: number): Promise<GetRoleResType> {
    const role = await this.roleRepo.findUnique({
      id: roleId,
    })
    if (!role) {
      throw RoleNotFoundException
    }
    return role
  }

  async deleteRole(roleId: number): Promise<MessageResType> {
    // Không cho phép bất cứ ai xóa 3 base role (Admin, Seller, Client)
    await this.handlePreventActionsOnBaseRoles(roleId)
    await this.roleRepo.delete({
      where: {
        id: roleId,
      },
      isHard: true,
    })
    return {
      message: 'Success.DeletedRole',
    }
  }
}
