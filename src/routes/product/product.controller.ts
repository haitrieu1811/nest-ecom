import { Controller, Get, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { GetProductsQueryDTO, GetProductsResDTO } from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetProductsResDTO })
  getProducts(@Query() query: GetProductsQueryDTO) {
    return this.productService.getProducts(query)
  }
}
