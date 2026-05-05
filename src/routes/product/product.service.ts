import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { ProductRepo } from 'src/routes/product/product.repo'
import { GetProductResType, GetProductsQueryType, GetProductsResType } from 'src/routes/product/product.schema'
import { ProductNotFoundException } from 'src/shared/error'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async getProducts(query: GetProductsQueryType): Promise<GetProductsResType> {
    const { totalProducts, products } = await this.productRepo.findMany({
      query: {
        ...query,
        isPublic: true,
      },
      languageId: I18nContext.current()?.lang as string,
    })
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
    const product = await this.productRepo.findDetail({
      productId,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true,
    })
    if (!product) {
      throw ProductNotFoundException
    }
    return product
  }
}
