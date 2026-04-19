import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const CategoryTranslationAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'languageId',
    message: 'Error.CategoryTranslationAlreadyExist',
  },
])

export const CategoryTranslationNotFoundException = new NotFoundException('Error.CategoryTranslationNotFound')

export const CategoryOrLanguageNotFoundException = new UnprocessableEntityException([
  {
    path: 'categoryId',
    message: 'Error.CategoryNotFound',
  },
  {
    path: 'languageId',
    message: 'Error.LanguageNotFound',
  },
])
