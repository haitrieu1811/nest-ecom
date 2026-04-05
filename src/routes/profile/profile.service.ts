import { Injectable } from '@nestjs/common'

import { OldPasswordIsIncorrectException, ProfileNotFoundException } from 'src/routes/profile/profile.error'
import { ProfileRepo } from 'src/routes/profile/profile.repo'
import {
  ChangePasswordBodyType,
  GetProfileResType,
  UpdateProfileBodyType,
  UpdateProfileResType,
} from 'src/routes/profile/profile.schema'
import { PhoneNumberAlreadyExistException } from 'src/shared/error'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepo: ProfileRepo,
    private readonly hashingService: HashingService,
    private readonly sharedUserRepo: SharedUserRepo,
  ) {}

  async getProfile(userId: number): Promise<GetProfileResType> {
    const profile = await this.profileRepo.findUnique({
      id: userId,
    })
    if (!profile) {
      throw ProfileNotFoundException
    }
    return profile
  }

  async updateProfile({
    userId,
    body,
  }: {
    userId: number
    body: UpdateProfileBodyType
  }): Promise<UpdateProfileResType> {
    try {
      const updatedUser = await this.sharedUserRepo.update({
        where: {
          id: userId,
        },
        data: body,
      })
      return updatedUser
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProfileNotFoundException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw PhoneNumberAlreadyExistException
      }
      throw error
    }
  }

  async changePassword({ userId, body }: { userId: number; body: ChangePasswordBodyType }): Promise<MessageResType> {
    const user = await this.sharedUserRepo.findUnique({
      id: userId,
    })
    if (!user) {
      throw ProfileNotFoundException
    }
    const isCorrectOldPassword = await this.hashingService.compare(body.oldPassword, user.password)
    if (!isCorrectOldPassword) {
      throw OldPasswordIsIncorrectException
    }
    const hashedPassword = await this.hashingService.hash(body.password)
    await this.sharedUserRepo.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    })
    return {
      message: 'Success.ChangedPassword',
    }
  }
}
