import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateRoleBodyType, UpdateRoleBodyType } from 'src/routes/role/role.schema'

import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { RoleIncludeCountType, RoleIncludePermissionsType, RoleType } from 'src/shared/schemas/shared-role.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

type RoleWhereUniqueObject =
  | {
      id: number
    }
  | {
      name: string
    }

@Injectable()
@SerializeAll()
export class RoleRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, userId }: { data: CreateRoleBodyType; userId: number }): Promise<RoleType> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        createdById: userId,
        permissions: {
          connect: data.permissionIds.map((id) => ({ id })),
        },
      },
    }) as any
  }

  async update({
    data,
    userId,
    where,
  }: {
    data: UpdateRoleBodyType
    userId: number
    where: RoleWhereUniqueObject
  }): Promise<RoleIncludePermissionsType> {
    if (data.permissionIds.length > 0) {
      const permissions = await this.prisma.permission.findMany({
        where: {
          id: {
            in: data.permissionIds,
          },
        },
      })
      const deletedPermissions = permissions.filter((permission) => permission.deletedAt)
      const permissionIds = deletedPermissions.map((permission) => permission.id).join(', ')
      if (deletedPermissions.length > 0) {
        throw new BadRequestException(`Các permission có id ${permissionIds} đã bị xóa.`)
      }
    }
    return this.prisma.role.update({
      where,
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        updatedById: userId,
        permissions: {
          set: data.permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            description: true,
            path: true,
            method: true,
            module: true,
          },
        },
      },
    }) as any
  }

  async findMany(): Promise<{
    roles: RoleIncludeCountType[]
    totalRoles: number
  }> {
    const [roles, totalRoles] = await Promise.all([
      this.prisma.role.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      }),
      this.prisma.role.count({
        where: {
          deletedAt: null,
        },
      }),
    ])
    return {
      roles: roles as any,
      totalRoles,
    }
  }

  findUnique(where: RoleWhereUniqueObject): Promise<RoleIncludePermissionsType | null> {
    return this.prisma.role.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            module: true,
            path: true,
            method: true,
            name: true,
            description: true,
          },
        },
      },
    }) as any
  }

  delete({ where, isHard }: { where: RoleWhereUniqueObject; isHard?: boolean }) {
    return !isHard
      ? this.prisma.role.update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
      : this.prisma.role.delete({
          where,
        })
  }
}
