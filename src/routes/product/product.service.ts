import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { ProductRepo } from 'src/routes/product/product.repo'
import { GetProductsQueryType, GetProductsResType } from 'src/routes/product/product.schema'

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  async getProducts(query: GetProductsQueryType): Promise<GetProductsResType> {
    const { totalProducts, products } = await this.productRepo.findMany({
      query,
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
}
