import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const ProfileNotFoundException = new NotFoundException('Error.ProfileNotFound')

export const PhoneNumberAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'phoneNumber',
    message: 'Error.PhoneNumberAlreadyExist',
  },
])
