import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const LanguageAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'id',
    message: 'Error.LanguageAlreadyExist',
  },
])

export const LanguageNotFoundException = new NotFoundException('Error.LanguageNotFound')
