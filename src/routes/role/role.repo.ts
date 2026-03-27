import { BadRequestException, Injectable } from '@nestjs/common'

import { RoleIncludePermissionsType, RoleType } from 'src/routes/role/role.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
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

  create({
    data,
    userId,
  }: {
    data: Pick<RoleType, 'name' | 'description' | 'isActive'>
    userId: number
  }): Promise<RoleType> {
    return this.prisma.role.create({
      data: {
        ...data,
        createdById: userId,
      },
    }) as any
  }

  async update({
    data,
    userId,
    where,
  }: {
    data: Partial<Pick<RoleType, 'name' | 'description' | 'isActive'>> & { permissionIds: number[] }
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
            path: true,
            method: true,
          },
        },
      },
    }) as any
  }

  async findMany({ page, limit }: PaginationQueryType): Promise<{
    roles: RoleType[]
    totalRoles: number
  }> {
    const [roles, totalRoles] = await Promise.all([
      this.prisma.role.findMany({
        where: {
          deletedAt: null,
        },
        skip: (page - 1) * limit,
        take: limit,
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
            path: true,
            method: true,
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
