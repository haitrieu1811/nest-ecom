import { Injectable } from '@nestjs/common'

import {
  ProductTranslationAlreadyExistException,
  ProductTranslationNotFoundException,
} from 'src/routes/product/product-translation/product-translation.error'
import { ProductTranslationRepo } from 'src/routes/product/product-translation/product-translation.repo'
import {
  CreateProductTranslationBodyType,
  CreateProductTranslationResType,
  GetProductTranslationResType,
  UpdateProductTranslationBodyType,
  UpdateProductTranslationResType,
} from 'src/routes/product/product-translation/product-translation.schema'
import { LanguageNotFoundException, ProductNotFoundException } from 'src/shared/error'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedLanguageRepo } from 'src/shared/repositories/shared-language.repo'
import { SharedProductRepo } from 'src/shared/repositories/shared-product.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class ProductTranslationService {
  constructor(
    private readonly productTranslationRepo: ProductTranslationRepo,
    private readonly sharedProductRepo: SharedProductRepo,
    private readonly sharedLanguageRepo: SharedLanguageRepo,
  ) {}

  /**
   * Hàm kiểm tra language và product có tồn tại hay không, nếu không sẽ ném lỗi tương ứng
   */
  async validateLanguageAndProduct(languageId: string, productId: number): Promise<boolean> {
    const [language, product] = await Promise.all([
      this.sharedLanguageRepo.findUnique({ id: languageId, deletedAt: null }),
      this.sharedProductRepo.findUnique({ id: productId, deletedAt: null }),
    ])
    if (!language) {
      throw LanguageNotFoundException
    }
    if (!product) {
      throw ProductNotFoundException
    }
    return true
  }

  async createProductTranslation({
    body,
    createdById,
  }: {
    body: CreateProductTranslationBodyType
    createdById: number
  }): Promise<CreateProductTranslationResType> {
    try {
      await this.validateLanguageAndProduct(body.languageId, body.productId)
      const result = await this.productTranslationRepo.create({
        data: body,
        createdById,
      })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistException
      }
      throw error
    }
  }

  async getProductTranslation(productTranslationId: number): Promise<GetProductTranslationResType> {
    const productTranslation = await this.productTranslationRepo.findUnique({
      id: productTranslationId,
    })
    if (!productTranslation) {
      throw ProductTranslationNotFoundException
    }
    return productTranslation
  }

  async updateProductTranslation({
    body,
    productTranslationId,
    updatedById,
  }: {
    body: UpdateProductTranslationBodyType
    productTranslationId: number
    updatedById: number
  }): Promise<UpdateProductTranslationResType> {
    try {
      const updatedProductTranslation = await this.productTranslationRepo.update({
        where: { id: productTranslationId },
        data: body,
        updatedById,
      })
      return updatedProductTranslation
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistException
      }
      throw error
    }
  }

  async deleteProductTranslation(productTranslationId: number): Promise<MessageResType> {
    try {
      await this.productTranslationRepo.delete({
        where: { id: productTranslationId },
      })
      return {
        message: 'Success.DeletedProductTranslation',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductTranslationNotFoundException
      }
      throw error
    }
  }
}
