import { Injectable } from '@nestjs/common'

import { ProductWhereUniqueInput } from 'generated/prisma/models'
import { GetProductsQueryType, ProductIncludeTranslationsType } from 'src/routes/product/product.schema'
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/utils.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    query: GetProductsQueryType,
    languageId: string,
  ): Promise<{
    totalProducts: number
    products: ProductIncludeTranslationsType[]
  }> {
    const skip = (query.page - 1) * query.limit
    const take = query.limit
    const [totalProducts, products] = await Promise.all([
      this.prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          productTranslations: {
            where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
          },
        },
        skip,
        take,
      }) as any,
    ])
    return {
      totalProducts,
      products,
    }
  }

  findUniqueIncludeTranslations(
    where: ProductWhereUniqueInput,
    languageId: string,
  ): Promise<ProductIncludeTranslationsType | null> {
    return this.prisma.product.findUnique({
      where,
      include: {
        productTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    }) as any
  }
}
