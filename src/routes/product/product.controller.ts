import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateProductBodyDTO,
  CreateProductResDTO,
  GetProductResDTO,
  GetProductsQueryDTO,
  GetProductsResDTO,
  ProductIdParamDTO,
  UpdateProductBodyDTO,
  UpdateProductResDTO,
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

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

  @Delete(':productId')
  @ZodResponse({ type: MessageResDTO })
  deleteProduct(@Param() param: ProductIdParamDTO) {
    return this.productService.deleteProduct(param.productId)
  }

  @Post()
  @ZodResponse({ type: CreateProductResDTO })
  createProduct(@Body() body: CreateProductBodyDTO, @ActiveUser('userId') createdById: number) {
    return this.productService.createProduct({
      body,
      createdById,
    })
  }

  @Put(':productId')
  @ZodResponse({ type: UpdateProductResDTO })
  updateProduct(
    @Param() param: ProductIdParamDTO,
    @Body() body: UpdateProductBodyDTO,
    @ActiveUser('userId') updatedById: number,
  ) {
    return this.productService.updateProduct({
      productId: param.productId,
      body,
      updatedById,
    })
  }
}
