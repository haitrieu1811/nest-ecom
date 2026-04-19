import { Injectable } from '@nestjs/common'

import {
  CategoryType,
  CreateCategoryBodyType,
  GetCategoriesQueryType,
  UpdateCategoryBodyType,
} from 'src/routes/category/category.schema'
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

  async findMany({ page, limit, parentId }: GetCategoriesQueryType): Promise<{
    categories: CategoryType[]
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
