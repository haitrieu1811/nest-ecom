import { NotFoundException } from '@nestjs/common'

export const ProfileNotFoundException = new NotFoundException('Error.ProfileNotFound')
