import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { ProductNotFoundException, SomeProductCategoriesNotFoundException } from 'src/routes/product/product.error'
import { ProductRepo } from 'src/routes/product/product.repo'
import {
  CreateProductBodyType,
  CreateProductResType,
  GetProductResType,
  GetProductsQueryType,
  GetProductsResType,
} from 'src/routes/product/product.schema'
import { BrandNotFoundException } from 'src/shared/error'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { SharedBrandRepo } from 'src/shared/repositories/shared-brand.repo'
import { SharedCategoryRepo } from 'src/shared/repositories/shared-category.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly sharedBrandRepo: SharedBrandRepo,
    private readonly sharedCategoryRepo: SharedCategoryRepo,
  ) {}

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

  async deleteProduct(productId: number): Promise<MessageResType> {
    try {
      await this.productRepo.delete({ id: productId })
      return {
        message: 'Success.ProductDeleted',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }

  async createProduct({
    body,
    createdById,
  }: {
    body: CreateProductBodyType
    createdById: number
  }): Promise<CreateProductResType> {
    // Kiểm tra brand có tồn tại không
    if (body.brandId) {
      const brand = await this.sharedBrandRepo.findUnique({
        id: body.brandId,
        deletedAt: null,
      })
      if (!brand) {
        throw BrandNotFoundException
      }
    }
    // Kiểm tra các id trong mảng categories có tồn tại tất cả không, nếu có bất kỳ id nào không tồn tại thì trả về lỗi
    if (body.categories.length > 0) {
      const categories = await this.sharedCategoryRepo.findMany(body.categories)
      if (categories.length !== body.categories.length) {
        throw SomeProductCategoriesNotFoundException
      }
    }
    // Tạo product mới
    const product = (await this.productRepo.create({
      data: body,
      createdById,
    })) as any
    return product
  }
}
