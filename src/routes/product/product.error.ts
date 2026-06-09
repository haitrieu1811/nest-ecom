import { NotFoundException } from '@nestjs/common'

export const ProductCategoryNotFoundException = new NotFoundException('Error.ProductCategoryNotFound')
