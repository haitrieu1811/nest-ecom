import { Injectable } from '@nestjs/common'
import { UserWhereInput } from 'generated/prisma/models'

import {
  CreateUserBodyType,
  GetListSellersResType,
  GetListUsersQueryType,
  GetSellerDetailResType,
  GetUserDetailResType,
} from 'src/routes/user/user.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { UserWhereUniqueObject } from 'src/shared/repositories/shared-user.repo'
import { UserIncludeRolePermissionsType, UserIncludeRoleType, UserType } from 'src/shared/schemas/shared-user.schema'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class UserRepo {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly sharedRoleRepo: SharedRoleRepo,
  ) {}

  async create({
    data,
    createdById,
  }: {
    data: CreateUserBodyType
    createdById: number
  }): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    const hashedPassword = await this.hashingService.hash(data.password)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        createdById,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any
  }

  delete({ where, isHard }: { where: UserWhereUniqueObject; isHard?: boolean }) {
    return !isHard
      ? this.prisma.user.update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        })
      : this.prisma.user.delete({
          where,
        })
  }

  async findMany(
    query: GetListUsersQueryType,
    whereInput?: UserWhereInput,
  ): Promise<{
    users: UserIncludeRoleType[]
    totalUsers: number
  }> {
    const where: UserWhereInput = whereInput || {}
    if (query.email) {
      where.email = {
        contains: query.email,
        mode: 'insensitive',
      }
    }
    const [users, totalUsers] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          role: true,
        },
        omit: {
          password: true,
          totpSecret: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])
    return {
      users: users as any,
      totalUsers,
    }
  }

  findUniqueIncludeRolePermissions(where: UserWhereUniqueObject): Promise<UserIncludeRolePermissionsType | null> {
    return this.prisma.user.findUnique({
      where,
      include: {
        role: {
          include: {
            permissions: {
              where: {
                deletedAt: null,
              },
              select: {
                id: true,
                path: true,
                method: true,
                name: true,
                description: true,
                module: true,
              },
            },
          },
        },
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any
  }

  getUserDetail(userId: number): Promise<GetUserDetailResType | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any
  }

  async getListSellers(query: GetListUsersQueryType): Promise<{
    sellers: GetListSellersResType['data']
    totalSellers: number
  }> {
    const sellerRoleId = await this.sharedRoleRepo.getSellerRoleId()
    const where: UserWhereInput = {
      deletedAt: null,
      roleId: sellerRoleId,
    }
    if (query.email) {
      where.email = {
        contains: query.email,
        mode: 'insensitive',
      }
    }
    const [sellers, totalSellers] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          avatar: true,
        },
      }),
      this.prisma.user.count({ where }),
    ])
    return {
      sellers: sellers as any,
      totalSellers,
    }
  }

  async getSellerDetail(userId: number): Promise<GetSellerDetailResType> {
    const sellerRoleId = await this.sharedRoleRepo.getSellerRoleId()
    return this.prisma.user.findUnique({
      where: {
        id: userId,
        roleId: sellerRoleId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    }) as any
  }
}
