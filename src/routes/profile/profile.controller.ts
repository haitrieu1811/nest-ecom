import { Body, Controller, Get, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { GetProfileResDTO, UpdateProfileBodyDTO, UpdateProfileResDTO } from 'src/routes/profile/profile.dto'
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

  @Put()
  @ZodResponse({ type: UpdateProfileResDTO })
  updateProfile(@Body() body: UpdateProfileBodyDTO, @ActiveUser('userId') userId: number) {
    return this.profileService.updateProfile({
      body,
      userId,
    })
  }
}
