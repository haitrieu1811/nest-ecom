import { Injectable } from '@nestjs/common'

import { CannotUpdateSubCategoryException, CategoryNotFoundException } from 'src/routes/category/category.error'
import { CategoryRepo } from 'src/routes/category/category.repo'
import {
  CreateCategoryBodyType,
  CreateCategoryResType,
  GetCategoriesQueryType,
  GetCategoriesResType,
  GetCategoryResType,
  UpdateCategoryBodyType,
  UpdateCategoryResType,
} from 'src/routes/category/category.schema'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepo) {}

  async createCategory({
    body,
    createdById,
  }: {
    body: CreateCategoryBodyType
    createdById: number
  }): Promise<CreateCategoryResType> {
    // Nếu có parentId thì kiểm tra parent category tồn tại
    if (body.parentId) {
      const parentCategory = await this.categoryRepo.findUnique({ id: body.parentId })
      if (!parentCategory) {
        throw CategoryNotFoundException
      }
    }
    return this.categoryRepo.create({
      data: body,
      createdById,
    })
  }

  async getCategories(query: GetCategoriesQueryType): Promise<GetCategoriesResType> {
    // Nếu có parentId thì kiểm tra parent category tồn tại, nếu không tồn tại thì trả về kết quả rỗng luôn thay vì trả về lỗi để tránh trường hợp người dùng chọn một parentId không tồn tại nào đó
    if (query.parentId) {
      const parentCategory = await this.categoryRepo.findUnique({ id: query.parentId })
      if (!parentCategory) {
        return {
          data: [],
          totalItems: 0,
        }
      }
    }
    const { categories, totalCategories } = await this.categoryRepo.findMany(query)
    return {
      data: categories,
      totalItems: totalCategories,
    }
  }

  async getCategory(categoryId: number): Promise<GetCategoryResType> {
    const category = await this.categoryRepo.findUnique({ id: categoryId })
    if (!category) {
      throw CategoryNotFoundException
    }
    return category as any
  }

  async updateCategory({
    body,
    updatedById,
    categoryId,
  }: {
    body: UpdateCategoryBodyType
    updatedById: number
    categoryId: number
  }): Promise<UpdateCategoryResType> {
    // Nếu là sub category thì không cho cập nhật, chỉ được xóa và tạo lại
    const category = await this.categoryRepo.findUnique({ id: categoryId })
    if (!category) {
      throw CategoryNotFoundException
    }
    if (category.parentId) {
      throw CannotUpdateSubCategoryException
    }
    const updatedCategory = await this.categoryRepo.update({
      categoryId,
      data: body,
      updatedById,
    })
    return updatedCategory
  }

  async deleteCategory(categoryId: number): Promise<MessageResType> {
    try {
      await this.categoryRepo.delete({ categoryId })
      return {
        message: 'Success.DeletedCategory',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw CategoryNotFoundException
      }
      throw error
    }
  }
}
