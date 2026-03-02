import { Injectable } from '@nestjs/common'

import { RegisterBodyType, RegisterResType } from 'src/routes/auth/auth.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class AuthRepo {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  findUniqueUser(uniqueObject: { email: string } | { id: number } | { phoneNumber: string }) {
    return this.prisma.user.findUnique({
      where: uniqueObject,
    })
  }

  async createUser({
    data,
    roleId,
  }: {
    data: Omit<RegisterBodyType, 'confirmPassword'>
    roleId: number
  }): Promise<RegisterResType> {
    const hashedPassword = await this.hashingService.hash(data.password)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        roleId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        avatar: true,
        roleId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as any
  }
}
