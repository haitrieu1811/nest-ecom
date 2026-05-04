import { UnprocessableEntityException } from '@nestjs/common'

export const SomeProductCategoriesNotFoundException = new UnprocessableEntityException([
  {
    path: 'categories',
    message: 'Error.SomeProductCategoriesNotFound',
  },
])
