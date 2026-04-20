import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  BrandTranslationIdParamDTO,
  CreateBrandTranslationBodyDTO,
  CreateBrandTranslationResDTO,
  GetBrandTranslationResDTO,
  UpdateBrandTranslationBodyDTO,
  UpdateBrandTranslationResDTO,
} from 'src/routes/brand/brand-translation/brand-translation.dto'
import { BrandTranslationService } from 'src/routes/brand/brand-translation/brand-translation.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Post()
  @ZodResponse({ type: CreateBrandTranslationResDTO })
  createBrandTranslation(@Body() body: CreateBrandTranslationBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.createBrandTranslation({ body, userId })
  }

  @Get(':brandTranslationId')
  @ZodResponse({ type: GetBrandTranslationResDTO })
  getBrandTranslation(@Param() param: BrandTranslationIdParamDTO) {
    return this.brandTranslationService.getBrandTranslation(param.brandTranslationId)
  }

  @Put(':brandTranslationId')
  @ZodResponse({ type: UpdateBrandTranslationResDTO })
  updateBrandTranslation(
    @Body() body: UpdateBrandTranslationBodyDTO,
    @Param() param: BrandTranslationIdParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.updateBrandTranslation({
      body,
      brandTranslationId: param.brandTranslationId,
      updatedById: userId,
    })
  }

  @Delete(':brandTranslationId')
  @ZodResponse({ type: MessageResDTO })
  deleteBrandTranslation(@Param() param: BrandTranslationIdParamDTO) {
    return this.brandTranslationService.deleteBrandTranslation(param.brandTranslationId)
  }
}
