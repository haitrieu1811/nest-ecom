import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const ProfileNotFoundException = new NotFoundException('Error.ProfileNotFound')

export const OldPasswordIsIncorrectException = new UnprocessableEntityException([
  {
    path: 'oldPassword',
    message: 'Error.OldPasswordIsIncorrect',
  },
])
