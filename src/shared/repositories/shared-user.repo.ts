import { Injectable } from '@nestjs/common'

import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserIncludeRolePermissionsType, UserType } from 'src/shared/schemas/shared-user.schema'
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
  }: {
    where: UserWhereUniqueObject
    data: Partial<Pick<UserType, 'name' | 'phoneNumber' | 'avatar' | 'password' | 'roleId' | 'status' | 'totpSecret'>>
  }): Promise<UserIncludeRolePermissionsType> {
    return this.prisma.user.update({
      where: {
        ...where,
        deletedAt: null,
      },
      data,
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
