import { Injectable } from '@nestjs/common'

import { ProfileNotFoundException } from 'src/routes/profile/profile.error'
import { ProfileRepo } from 'src/routes/profile/profile.repo'
import { GetProfileResType } from 'src/routes/profile/profile.schema'

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
}
