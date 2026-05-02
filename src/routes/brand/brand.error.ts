import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

export const BrandAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'name',
    message: 'Error.BrandAlreadyExist',
  },
])

export const BrandNotAuthorOrAdminException = new ForbiddenException('Error.BrandNotAuthorOrAdmin')
