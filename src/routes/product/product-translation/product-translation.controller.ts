import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateProductTranslationBodyDTO,
  CreateProductTranslationResDTO,
  GetProductTranslationResDTO,
  ProductTranslationIdParamDTO,
  UpdateProductTranslationBodyDTO,
  UpdateProductTranslationResDTO,
} from 'src/routes/product/product-translation/product-translation.dto'
import { ProductTranslationService } from 'src/routes/product/product-translation/product-translation.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Post()
  @ZodResponse({ type: CreateProductTranslationResDTO })
  createProductTranslation(@Body() body: CreateProductTranslationBodyDTO, @ActiveUser('userId') createdById: number) {
    return this.productTranslationService.createProductTranslation({ body, createdById })
  }

  @Get(':productTranslationId')
  @IsPublic()
  @ZodResponse({ type: GetProductTranslationResDTO })
  getProductTranslation(@Param() param: ProductTranslationIdParamDTO) {
    return this.productTranslationService.getProductTranslation(param.productTranslationId)
  }

  @Put(':productTranslationId')
  @ZodResponse({ type: UpdateProductTranslationResDTO })
  updateProductTranslation(
    @Body() body: UpdateProductTranslationBodyDTO,
    @Param() param: ProductTranslationIdParamDTO,
    @ActiveUser('userId') updatedById: number,
  ) {
    return this.productTranslationService.updateProductTranslation({
      body,
      productTranslationId: param.productTranslationId,
      updatedById,
    })
  }

  @Delete(':productTranslationId')
  @ZodResponse({ type: MessageResDTO })
  deleteProductTranslation(@Param() param: ProductTranslationIdParamDTO) {
    return this.productTranslationService.deleteProductTranslation(param.productTranslationId)
  }
}
