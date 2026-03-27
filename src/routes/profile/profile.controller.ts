import { Controller, Get } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { GetProfileResDTO } from 'src/routes/profile/profile.dto'
import { ProfileService } from 'src/routes/profile/profile.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodResponse({ type: GetProfileResDTO })
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId)
  }
}
