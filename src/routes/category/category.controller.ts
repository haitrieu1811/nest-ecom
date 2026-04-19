import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CategoryIdParamDTO,
  CreateCategoryBodyDTO,
  CreateCategoryResDTO,
  GetCategoriesQueryDTO,
  GetCategoriesResDTO,
  GetCategoryResDTO,
  UpdateCategoryBodyDTO,
  UpdateCategoryResDTO,
} from 'src/routes/category/category.dto'
import { CategoryService } from 'src/routes/category/category.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ZodResponse({ type: CreateCategoryResDTO })
  createCategory(@Body() body: CreateCategoryBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryService.createCategory({ body, createdById: userId })
  }

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetCategoriesResDTO })
  getCategories(@Query() query: GetCategoriesQueryDTO) {
    return this.categoryService.getCategories(query)
  }

  @Get(':categoryId')
  @IsPublic()
  @ZodResponse({ type: GetCategoryResDTO })
  getCategory(@Param() param: CategoryIdParamDTO) {
    return this.categoryService.getCategory(param.categoryId)
  }

  @Put(':categoryId')
  @ZodResponse({ type: UpdateCategoryResDTO })
  updateCategory(
    @Body() body: UpdateCategoryBodyDTO,
    @ActiveUser('userId') userId: number,
    @Param() param: CategoryIdParamDTO,
  ) {
    return this.categoryService.updateCategory({ body, updatedById: userId, categoryId: param.categoryId })
  }

  @Delete(':categoryId')
  @ZodResponse({ type: MessageResDTO })
  deleteCategory(@Param() param: CategoryIdParamDTO) {
    return this.categoryService.deleteCategory(param.categoryId)
  }
}
