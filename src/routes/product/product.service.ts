import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { SomeProductCategoriesNotFoundException } from 'src/routes/product/product.error'
import { ProductRepo } from 'src/routes/product/product.repo'
import {
  CreateProductBodyType,
  CreateProductResType,
  GetProductResType,
  GetProductsQueryType,
  GetProductsResType,
  UpdateProductBodyType,
  UpdateProductResType,
} from 'src/routes/product/product.schema'
import { BrandNotFoundException, ProductNotFoundException } from 'src/shared/error'
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

  /**
   * Hàm validateBrandAndCategories dùng để kiểm tra xem brandId có tồn tại trong bảng brand hay không và các categoryIds có tồn tại trong bảng category hay không. Nếu brandId không tồn tại thì sẽ ném ra lỗi BrandNotFoundException, nếu có bất kỳ categoryId nào không tồn tại thì sẽ ném ra lỗi SomeProductCategoriesNotFoundException. Hàm này sẽ được gọi trong cả createProduct và updateProduct để đảm bảo dữ liệu hợp lệ trước khi thực hiện các thao tác tạo mới hoặc cập nhật sản phẩm.
   */
  private validateBrandAndCategories = async (brandId: number | null, categoryIds: number[]): Promise<boolean> => {
    // Kiểm tra brand có tồn tại không
    if (brandId) {
      const brand = await this.sharedBrandRepo.findUnique({
        id: brandId,
        deletedAt: null,
      })
      if (!brand) {
        throw BrandNotFoundException
      }
    }
    // Kiểm tra các id trong mảng categories có tồn tại tất cả không, nếu có bất kỳ id nào không tồn tại thì trả về lỗi
    if (categoryIds.length > 0) {
      const categories = await this.sharedCategoryRepo.findMany(categoryIds)
      if (categories.length !== categoryIds.length) {
        throw SomeProductCategoriesNotFoundException
      }
    }
    return true
  }

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
    const product = await this.productRepo.findUniqueDetail(
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
    await this.validateBrandAndCategories(body.brandId, body.categories)
    // Tạo product mới
    const product = (await this.productRepo.create({
      data: body,
      createdById,
    })) as any
    return product
  }

  async updateProduct({
    productId,
    body,
    updatedById,
  }: {
    body: UpdateProductBodyType
    productId: number
    updatedById: number
  }): Promise<UpdateProductResType> {
    try {
      await this.validateBrandAndCategories(body.brandId, body.categories)
      const product = await this.productRepo.update({
        data: body,
        productId,
        updatedById,
      })
      return product
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }
}
