import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  GetProductResDTO,
  GetProductsQueryDTO,
  GetProductsResDTO,
  ProductIdParamDTO,
} from 'src/routes/product/product.dto'
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

  @Get(':productId')
  @IsPublic()
  @ZodResponse({ type: GetProductResDTO })
  getProduct(@Param() param: ProductIdParamDTO) {
    return this.productService.getProduct(param.productId)
  }
}
