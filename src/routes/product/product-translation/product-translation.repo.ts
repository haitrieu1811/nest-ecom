import { Injectable } from '@nestjs/common'

import {
  CreateProductTranslationBodyType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from 'src/routes/product/product-translation/product-translation.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

type ProductTranslationUniqueObject =
  | {
      id: number
    }
  | {
      languageId_productId: {
        languageId: string
        productId: number
      }
    }

@Injectable()
@SerializeAll()
export class ProductTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({
    data,
    createdById,
  }: {
    data: CreateProductTranslationBodyType
    createdById: number
  }): Promise<ProductTranslationType> {
    return this.prisma.productTranslation.create({
      data: {
        ...data,
        createdById,
      },
    }) as any
  }

  findUnique(where: ProductTranslationUniqueObject): Promise<ProductTranslationType | null> {
    return this.prisma.productTranslation.findUnique({
      where: { ...where, deletedAt: null },
    }) as any
  }

  update({
    where,
    data,
    updatedById,
  }: {
    where: ProductTranslationUniqueObject
    data: UpdateProductTranslationBodyType
    updatedById: number
  }): Promise<ProductTranslationType> {
    return this.prisma.productTranslation.update({
      where: { ...where, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    }) as any
  }

  delete({ where, isHard }: { where: ProductTranslationUniqueObject; isHard?: boolean }) {
    return isHard
      ? this.prisma.productTranslation.delete({
          where,
        })
      : this.prisma.productTranslation.update({
          where: { ...where, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
