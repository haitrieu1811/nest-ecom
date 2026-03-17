import { Injectable } from '@nestjs/common'

import { PermissionAlreadyExistException, PermissionNotFoundException } from 'src/routes/permission/permission.error'
import { PermissionRepo } from 'src/routes/permission/permission.repo'
import {
  CreatePermissionBodyType,
  GetPermissionResType,
  GetPermissionsResType,
  UpdatePermissionBodyType,
  UpdatePermissionResType,
} from 'src/routes/permission/permission.schema'
import { isNotFoundPrismaErrror, isUniqueConstraintPrismaErrror } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepo) {}

  async createPermission({ body, userId }: { body: CreatePermissionBodyType; userId: number }) {
    try {
      const result = await this.permissionRepo.create({ data: body, userId })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaErrror(error)) {
        throw PermissionAlreadyExistException
      }
      throw error
    }
  }

  async getPermissions(query: PaginationQueryType): Promise<GetPermissionsResType> {
    const [permissions, totalRows] = await Promise.all([
      this.permissionRepo.findMany(query),
      this.permissionRepo.count(),
    ])
    return {
      data: permissions,
      pagination: {
        ...query,
        totalRows,
        totalPages: Math.ceil(totalRows / query.limit),
      },
    }
  }

  async getPermission(permissionId: number): Promise<GetPermissionResType> {
    const permission = await this.permissionRepo.findUnique({
      id: permissionId,
    })
    if (!permission) {
      throw PermissionNotFoundException
    }
    return permission
  }

  async updatePermission({
    permissionId,
    body,
    userId,
  }: {
    permissionId: number
    body: UpdatePermissionBodyType
    userId: number
  }): Promise<UpdatePermissionResType> {
    try {
      const result = await this.permissionRepo.update({
        where: {
          id: permissionId,
        },
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw PermissionNotFoundException
      }
      if (isUniqueConstraintPrismaErrror(error)) {
        throw PermissionAlreadyExistException
      }
      throw error
    }
  }

  async deletePermission(permissionId: number): Promise<MessageResType> {
    try {
      await this.permissionRepo.delete({
        where: {
          id: permissionId,
        },
        isHard: true,
      })
      return {
        message: 'Success.DeletePermission',
      }
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw PermissionNotFoundException
      }
      throw error
    }
  }
}
