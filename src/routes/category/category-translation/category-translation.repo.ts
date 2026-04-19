import { Injectable } from '@nestjs/common'

import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType,
} from 'src/routes/category/category-translation/category-translation.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class CategoryTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({
    data,
    createdById,
  }: {
    data: CreateCategoryTranslationBodyType
    createdById: number
  }): Promise<CategoryTranslationType> {
    return this.prisma.categoryTranslation.create({
      data: {
        ...data,
        createdById,
      },
    }) as any
  }

  findUnique(categoryTranslationId: number): Promise<CategoryTranslationType | null> {
    return this.prisma.categoryTranslation.findUnique({
      where: { id: categoryTranslationId, deletedAt: null },
    }) as any
  }

  update({
    categoryTranslationId,
    data,
    updatedById,
  }: {
    categoryTranslationId: number
    data: UpdateCategoryTranslationBodyType
    updatedById: number
  }): Promise<CategoryTranslationType> {
    return this.prisma.categoryTranslation.update({
      where: { id: categoryTranslationId, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    }) as any
  }

  delete({ categoryTranslationId, isHard }: { categoryTranslationId: number; isHard?: boolean }) {
    return isHard
      ? this.prisma.categoryTranslation.delete({
          where: { id: categoryTranslationId },
        })
      : this.prisma.categoryTranslation.update({
          where: { id: categoryTranslationId, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
