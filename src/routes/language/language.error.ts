import { UnprocessableEntityException } from '@nestjs/common'

export const LanguageAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'id',
    message: 'Error.LanguageAlreadyExist',
  },
])
