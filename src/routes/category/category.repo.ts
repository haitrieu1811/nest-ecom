import { Injectable } from '@nestjs/common'

import {
  CategoryIncludeTranslationsType,
  CategoryType,
  CreateCategoryBodyType,
  GetCategoriesQueryType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.schema'
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/utils.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

type CategoryWhereUniqueObject = {
  id: number
}

@Injectable()
@SerializeAll()
export class CategoryRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, createdById }: { data: CreateCategoryBodyType; createdById: number }): Promise<CategoryType> {
    return this.prisma.category.create({
      data: {
        ...data,
        createdById,
      },
    }) as any
  }

  async findMany({ page, limit, parentId, languageId }: GetCategoriesQueryType & { languageId: string }): Promise<{
    categories: CategoryIncludeTranslationsType[]
    totalCategories: number
  }> {
    const where = {
      deletedAt: null,
      parentId: parentId ?? null, // Nếu parentId không được truyền vào thì tìm tất cả category cấp 1, nếu được truyền vào thì tìm category theo parentId
    }
    const [categories, totalCategories] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categoryTranslations: {
            where:
              languageId === ALL_LANGUAGES_CODE
                ? {
                    deletedAt: null,
                  }
                : {
                    deletedAt: null,
                    languageId,
                  },
          },
        },
      }) as any,
      this.prisma.category.count({ where }),
    ])
    return {
      categories,
      totalCategories,
    }
  }

  findUnique(where: CategoryWhereUniqueObject): Promise<CategoryType | null> {
    return this.prisma.category.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    }) as any
  }

  update({
    categoryId,
    data,
    updatedById,
  }: {
    categoryId: number
    data: UpdateCategoryBodyType
    updatedById: number
  }): Promise<CategoryType> {
    return this.prisma.category.update({
      where: { id: categoryId, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    }) as any
  }

  delete({ categoryId, isHard }: { categoryId: number; isHard?: boolean }) {
    return isHard
      ? this.prisma.category.delete({
          where: { id: categoryId },
        })
      : this.prisma.category.update({
          where: { id: categoryId, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
