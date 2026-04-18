import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const BrandAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'name',
    message: 'Error.BrandAlreadyExist',
  },
])

export const BrandNotFoundException = new NotFoundException('Error.BrandNotFound')

export const BrandNotAuthorOrAdminException = new ForbiddenException('Error.BrandNotAuthorOrAdmin')
