import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const BrandTranslationAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'languageId',
    message: 'Error.BrandTranslationAlreadyExist',
  },
])

export const BrandTranslationNotFoundException = new NotFoundException('Error.BrandTranslationNotFound')

export const BrandOrLanuageNotFoundException = new UnprocessableEntityException([
  {
    path: 'brandId',
    message: 'Error.BrandNotFound',
  },
  {
    path: 'languageId',
    message: 'Error.LanguageNotFound',
  },
])
