import { Injectable } from '@nestjs/common'

import { CreateUserBodyType } from 'src/routes/user/user.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserType } from 'src/shared/schemas/shared-user.schema'
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
}
