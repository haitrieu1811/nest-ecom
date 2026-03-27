import { Injectable } from '@nestjs/common'

import {
  ProhibitedActionOnBaseRoleException,
  RoleAlreadyExistException,
  RoleNotFoundException,
} from 'src/routes/role/role.error'
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
import { PermissionNotFoundException } from 'src/shared/errors/shared-permission.error'
import { isNotFoundPrismaErrror, isUniqueConstraintPrismaErrror } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  async createRole({ body, userId }: { body: CreateRoleBodyType; userId: number }): Promise<CreateRoleResType> {
    try {
      const result = await this.roleRepo.create({
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaErrror(error)) {
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
      const role = await this.roleRepo.findUnique({
        id: roleId,
      })
      if (!role) {
        throw RoleNotFoundException
      }
      // Không cho phép bất cứ ai cập nhật role Admin
      if (role.name === ROLE_NAME.ADMIN) {
        throw ProhibitedActionOnBaseRoleException
      }
      const updatedRole = await this.roleRepo.update({
        where: {
          id: roleId,
        },
        data: body,
        userId,
      })
      return updatedRole
    } catch (error) {
      if (isUniqueConstraintPrismaErrror(error)) {
        throw RoleAlreadyExistException
      }
      if (isNotFoundPrismaErrror(error)) {
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
    const role = await this.roleRepo.findUnique({
      id: roleId,
    })
    if (!role) {
      throw RoleNotFoundException
    }
    // Không cho phép bất cứ ai xóa 3 base role (Admin, Seller, Client)
    const baseRoles: string[] = [ROLE_NAME.ADMIN, ROLE_NAME.SELLER, ROLE_NAME.CLIENT]
    if (baseRoles.includes(role.name)) {
      throw ProhibitedActionOnBaseRoleException
    }
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
