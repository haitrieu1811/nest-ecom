import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const ProductTranslationAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'languageId',
    message: 'Error.ProductTranslationAlreadyExist',
  },
  {
    path: 'productId',
    message: 'Error.ProductTranslationAlreadyExist',
  },
])

export const ProductTranslationNotFoundException = new NotFoundException('Error.ProductTranslationNotFound')
