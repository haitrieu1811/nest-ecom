import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { ProductNotFoundException } from 'src/routes/product/product.error'
import { ProductRepo } from 'src/routes/product/product.repo'
import { GetProductResType, GetProductsQueryType, GetProductsResType } from 'src/routes/product/product.schema'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async getProducts(query: GetProductsQueryType): Promise<GetProductsResType> {
    const { totalProducts, products } = await this.productRepo.findMany(query, I18nContext.current()?.lang as string)
    return {
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(totalProducts / query.limit),
        totalRows: totalProducts,
      },
    }
  }

  async getProduct(productId: number): Promise<GetProductResType> {
    const product = await this.productRepo.findUniqueIncludeTranslations(
      { id: productId, deletedAt: null },
      I18nContext.current()?.lang as string,
    )
    if (!product) {
      throw ProductNotFoundException
    }
    return product
  }
}
