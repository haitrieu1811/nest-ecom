import { Injectable } from '@nestjs/common'

import {
  RoleAlreadyExistException,
  RoleNotFoundException,
  RoleOrPermissionNotFoundException,
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
      const result = await this.roleRepo.update({
        where: {
          id: roleId,
        },
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaErrror(error)) {
        throw RoleAlreadyExistException
      } else if (isNotFoundPrismaErrror(error)) {
        throw RoleOrPermissionNotFoundException
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
    try {
      await this.roleRepo.delete({
        where: {
          id: roleId,
        },
        isHard: true,
      })
      return {
        message: 'Success.DeletedRole',
      }
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }
}
