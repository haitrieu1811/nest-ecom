import { NotFoundException } from '@nestjs/common'

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound')
