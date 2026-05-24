import { Injectable } from '@nestjs/common'
import { UserWhereInput } from 'generated/prisma/models'

import { CreateUserBodyType, GetUsersQueryType } from 'src/routes/user/user.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
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

  async findMany(query: GetUsersQueryType): Promise<{
    users: UserIncludeRoleType[]
    totalUsers: number
  }> {
    const where: UserWhereInput = {}
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
                path: true,
                method: true,
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
}
