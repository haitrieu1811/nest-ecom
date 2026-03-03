import { Injectable } from '@nestjs/common'

import { RegisterBodyType, RegisterResType, VerificationCode } from 'src/routes/auth/auth.schema'
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

  async createUser({
    data,
    roleId,
  }: {
    data: Omit<RegisterBodyType, 'confirmPassword' | 'code'>
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

  createVerificationCode(
    data: Pick<VerificationCode, 'email' | 'code' | 'type' | 'expiresAt'>,
  ): Promise<VerificationCode> {
    return this.prisma.verificationCode.upsert({
      where: {
        email_type: {
          email: data.email,
          type: data.type,
        },
      },
      create: data,
      update: {
        code: data.code,
        expiresAt: data.expiresAt,
      },
    }) as any
  }

  findFirstVerificationCode(
    where: Pick<VerificationCode, 'email' | 'code' | 'type'>,
  ): Promise<VerificationCode | null> {
    return this.prisma.verificationCode.findFirst({
      where,
    }) as any
  }
}
