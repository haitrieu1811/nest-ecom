import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CategoryTranslationIdParamDTO,
  CreateCategoryTranslationBodyDTO,
  CreateCategoryTranslationResDTO,
  GetCategoryTranslationResDTO,
  UpdateCategoryTranslationBodyDTO,
  UpdateCategoryTranslationResDTO,
} from 'src/routes/category/category-translation/category-translation.dto'
import { CategoryTranslationService } from 'src/routes/category/category-translation/category-translation.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Post()
  @ZodResponse({ type: CreateCategoryTranslationResDTO })
  createCategoryTranslation(@Body() body: CreateCategoryTranslationBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.createCategoryTranslation({ body, createdById: userId })
  }

  @Get(':categoryTranslationId')
  @IsPublic()
  @ZodResponse({ type: GetCategoryTranslationResDTO })
  getCategoryTranslation(@Param() param: CategoryTranslationIdParamDTO) {
    return this.categoryTranslationService.getCategoryTranslation(param.categoryTranslationId)
  }

  @Put(':categoryTranslationId')
  @ZodResponse({ type: UpdateCategoryTranslationResDTO })
  updateCategoryTranslation(
    @Body() body: UpdateCategoryTranslationBodyDTO,
    @Param() param: CategoryTranslationIdParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.updateCategoryTranslation({
      body,
      categoryTranslationId: param.categoryTranslationId,
      updatedById: userId,
    })
  }

  @Delete(':categoryTranslationId')
  @ZodResponse({ type: MessageResDTO })
  deleteCategoryTranslation(@Param() param: CategoryTranslationIdParamDTO) {
    return this.categoryTranslationService.deleteCategoryTranslation(param.categoryTranslationId)
  }
}
