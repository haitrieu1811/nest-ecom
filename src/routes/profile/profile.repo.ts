import { Injectable } from '@nestjs/common'
import { GetProfileResType } from 'src/routes/profile/profile.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'

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

  findUnique(where: ProfileWhereUniqueObject): Promise<GetProfileResType | null> {
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
}
