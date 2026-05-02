import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound')

export const SomeProductCategoriesNotFoundException = new UnprocessableEntityException([
  {
    path: 'categories',
    message: 'Error.SomeProductCategoriesNotFound',
  },
])
