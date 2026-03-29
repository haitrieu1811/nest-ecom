import { Injectable } from '@nestjs/common'

import { PhoneNumberAlreadyExistException, ProfileNotFoundException } from 'src/routes/profile/profile.error'
import { ProfileRepo } from 'src/routes/profile/profile.repo'
import { GetProfileResType, UpdateProfileBodyType, UpdateProfileResType } from 'src/routes/profile/profile.schema'
import { isNotFoundPrismaErrror, isUniqueConstraintPrismaErrror } from 'src/shared/helpers'

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepo: ProfileRepo) {}

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
      const updatedUser = await this.profileRepo.update({
        where: {
          id: userId,
        },
        data: body,
      })
      return updatedUser
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw ProfileNotFoundException
      }
      if (isUniqueConstraintPrismaErrror(error)) {
        throw PhoneNumberAlreadyExistException
      }
      throw error
    }
  }
}
