import { Injectable } from '@nestjs/common'

import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserIncludeRolePermissionsType, UserIncludeRoleType, UserType } from 'src/shared/schemas/shared-user.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

export type UserWhereUniqueObject = { email: string } | { id: number } | { phoneNumber: string }

@Injectable()
@SerializeAll()
export class SharedUserRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(uniqueObject: UserWhereUniqueObject): Promise<UserType | null> {
    return this.prisma.user.findUnique({
      where: {
        ...uniqueObject,
        deletedAt: null,
      },
    }) as any
  }

  update({
    where,
    data,
    updatedById,
  }: {
    where: UserWhereUniqueObject
    data: Partial<
      Pick<UserType, 'email' | 'name' | 'phoneNumber' | 'avatar' | 'password' | 'roleId' | 'status' | 'totpSecret'>
    >
    updatedById?: number
  }): Promise<UserIncludeRolePermissionsType> {
    return this.prisma.user.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
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
                id: true,
                module: true,
                name: true,
                description: true,
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

  updateIncludeRole({
    where,
    data,
    updatedById,
  }: {
    where: UserWhereUniqueObject
    data: Partial<
      Pick<UserType, 'email' | 'name' | 'phoneNumber' | 'avatar' | 'password' | 'roleId' | 'status' | 'totpSecret'>
    >
    updatedById?: number
  }): Promise<UserIncludeRoleType> {
    return this.prisma.user.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
      include: {
        role: true,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any
  }

  findUniqueOmitPasswordAndTotpSecret(
    uniqueObject: UserWhereUniqueObject,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'> | null> {
    return this.prisma.user.findUnique({
      where: { ...uniqueObject, deletedAt: null },
      omit: {
        password: true,
        totpSecret: true,
      },
    }) as any
  }
}
