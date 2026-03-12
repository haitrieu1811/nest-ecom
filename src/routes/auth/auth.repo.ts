import { Injectable } from '@nestjs/common'

import { DeviceType, RegisterBodyType, VerificationCode } from 'src/routes/auth/auth.schema'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserType } from 'src/shared/schemas/shared-user.schema'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

type VerificationCodeWhereUnique =
  | {
      email_type: {
        email: string
        type: TypeOfVerificationCode
      }
    }
  | {
      id: number
    }

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
  }): Promise<Omit<UserType, 'password' | 'totpSecret' | 'deletedAt' | 'createdById' | 'updatedById'>> {
    const hashedPassword = await this.hashingService.hash(data.password)
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        roleId,
      },
      omit: {
        password: true,
        totpSecret: true,
        deletedAt: true,
        createdById: true,
        updatedById: true,
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

  createRefreshToken(data: { token: string; expiresAt: string; userId: number; deviceId: number }) {
    return this.prisma.refreshToken.create({
      data,
    })
  }

  createDevice(data: Pick<DeviceType, 'ip' | 'userAgent' | 'userId'>) {
    return this.prisma.device.create({
      data,
    })
  }

  findUniqueRefreshTokenIncludeUserAndDevice(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
        device: true,
      },
    })
  }

  deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({
      where: {
        token,
      },
    })
  }

  updateDevice({ deviceId, data }: { deviceId: number; data: Partial<DeviceType> }) {
    return this.prisma.device.update({
      where: {
        id: deviceId,
      },
      data,
    })
  }

  findUniqueUserIncludeRole(
    uniqueObject:
      | {
          id: number
        }
      | {
          email: string
        }
      | {
          phoneNumber: string
        },
  ) {
    return this.prisma.user.findUnique({
      where: uniqueObject,
      include: {
        role: true,
      },
    })
  }

  createUserIncludeRole(data: Pick<UserType, 'email' | 'password' | 'avatar' | 'name' | 'roleId'>) {
    return this.prisma.user.create({
      data,
      include: {
        role: true,
      },
    })
  }

  findUniqueVerificationCode(uniqueObject: VerificationCodeWhereUnique) {
    return this.prisma.verificationCode.findUnique({
      where: uniqueObject,
    })
  }

  updateUser({
    where,
    data,
  }: {
    where: { id: number } | { email: string } | { phoneNumber: string }
    data: Omit<Partial<UserType>, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'updatedById' | 'roleId' | 'email'>
  }) {
    return this.prisma.user.update({
      where,
      data,
      omit: {
        password: true,
        totpSecret: true,
        deletedAt: true,
        createdById: true,
        updatedById: true,
      },
    })
  }

  deleteVerificationCode(where: VerificationCodeWhereUnique) {
    return this.prisma.verificationCode.delete({
      where,
    })
  }
}
