import { Injectable } from '@nestjs/common'

import {
  CreatePermissionBodyType,
  CreatePermissionResType,
  PermissionType,
} from 'src/routes/permission/permission.schema'
import { HttpMethodType } from 'src/shared/constants/permission.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { PrismaService } from 'src/shared/services/prisma.service'

type PermissionWhereUniqueObjectType =
  | {
      id: number
    }
  | {
      path_method: {
        path: string
        method: HttpMethodType
      }
    }

@Injectable()
@SerializeAll()
export class PermissionRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, userId }: { data: CreatePermissionBodyType; userId: number }): Promise<CreatePermissionResType> {
    return this.prisma.permission.create({
      data: {
        ...data,
        createdById: userId,
        updatedById: userId,
      },
    }) as any
  }

  findMany({ page, limit }: PaginationQueryType): Promise<PermissionType[]> {
    return this.prisma.permission.findMany({
      where: {
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
    }) as any
  }

  count(): Promise<number> {
    return this.prisma.permission.count({
      where: {
        deletedAt: null,
      },
    })
  }

  findUnique(uniqueObject: PermissionWhereUniqueObjectType): Promise<PermissionType | null> {
    return this.prisma.permission.findUnique({
      where: {
        ...uniqueObject,
        deletedAt: null,
      },
    }) as any
  }

  update({
    where,
    data,
    userId,
  }: {
    where: PermissionWhereUniqueObjectType
    data: Partial<Pick<PermissionType, 'name' | 'description' | 'path' | 'method'>>
    userId: number
  }): Promise<PermissionType> {
    return this.prisma.permission.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById: userId,
      },
    }) as any
  }

  delete({ where, isHard }: { where: PermissionWhereUniqueObjectType; isHard?: boolean }) {
    return !isHard
      ? this.prisma.permission.update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
      : this.prisma.permission.delete({
          where,
        })
  }
}
