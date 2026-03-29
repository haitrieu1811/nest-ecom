import { Injectable } from '@nestjs/common'

import { ProfileType } from 'src/routes/profile/profile.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserType } from 'src/shared/schemas/shared-user.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

type ProfileWhereUniqueObject =
  | {
      id: number
    }
  | {
      email: string
    }
  | {
      phoneNumber: string
    }

@Injectable()
@SerializeAll()
export class ProfileRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(where: ProfileWhereUniqueObject): Promise<ProfileType | null> {
    return this.prisma.user.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
      omit: {
        password: true,
        totpSecret: true,
        deletedAt: true,
        roleId: true,
        createdById: true,
        updatedById: true,
        createdAt: true,
        updatedAt: true,
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
              },
            },
          },
        },
      },
    }) as any
  }

  update({
    where,
    data,
  }: {
    where: ProfileWhereUniqueObject
    data: Partial<Pick<UserType, 'name' | 'phoneNumber' | 'avatar' | 'password'>>
  }): Promise<ProfileType> {
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
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        updatedById: true,
        createdById: true,
      },
    }) as any
  }
}
