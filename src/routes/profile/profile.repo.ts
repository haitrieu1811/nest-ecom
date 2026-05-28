import { Injectable } from '@nestjs/common'

import { ProfileType } from 'src/routes/profile/profile.schema'
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

  findUnique(where: ProfileWhereUniqueObject): Promise<ProfileType | null> {
    return this.prisma.user.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
      omit: {
        password: true,
        totpSecret: true,
      },
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
    }) as any
  }
}
