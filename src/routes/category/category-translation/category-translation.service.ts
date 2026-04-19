import { Injectable } from '@nestjs/common'

import {
  CategoryOrLanguageNotFoundException,
  CategoryTranslationAlreadyExistException,
  CategoryTranslationNotFoundException,
} from 'src/routes/category/category-translation/category-translation.error'
import { CategoryTranslationRepo } from 'src/routes/category/category-translation/category-translation.repo'
import {
  CreateCategoryTranslationBodyType,
  CreateCategoryTranslationResType,
  GetCategoryTranslationResType,
  UpdateCategoryTranslationBodyType,
  UpdateCategoryTranslationResType,
} from 'src/routes/category/category-translation/category-translation.schema'
import { isForeignKeyConstraintPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepo: CategoryTranslationRepo) {}

  async createCategoryTranslation({
    body,
    createdById,
  }: {
    body: CreateCategoryTranslationBodyType
    createdById: number
  }): Promise<CreateCategoryTranslationResType> {
    try {
      const result = await this.categoryTranslationRepo.create({
        data: body,
        createdById,
      })
      return result
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw CategoryOrLanguageNotFoundException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw CategoryTranslationAlreadyExistException
      }
      throw error
    }
  }

  async getCategoryTranslation(categoryTranslationId: number): Promise<GetCategoryTranslationResType> {
    const categoryTranslation = await this.categoryTranslationRepo.findUnique(categoryTranslationId)
    if (!categoryTranslation) {
      throw CategoryTranslationNotFoundException
    }
    return categoryTranslation
  }

  updateCategoryTranslation({
    body,
    categoryTranslationId,
    updatedById,
  }: {
    body: UpdateCategoryTranslationBodyType
    categoryTranslationId: number
    updatedById: number
  }): Promise<UpdateCategoryTranslationResType> {
    return this.categoryTranslationRepo.update({
      categoryTranslationId,
      data: body,
      updatedById,
    })
  }

  async deleteCategoryTranslation(categoryTranslationId: number): Promise<MessageResType> {
    await this.categoryTranslationRepo.delete({
      categoryTranslationId,
    })
    return {
      message: 'Success.DeletedCategoryTranslation',
    }
  }
}
