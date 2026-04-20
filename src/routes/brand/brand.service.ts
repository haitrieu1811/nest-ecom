import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { BrandAlreadyExistException, BrandNotFoundException } from 'src/routes/brand/brand.error'
import { BrandRepo } from 'src/routes/brand/brand.repo'
import {
  CreateBrandBodyType,
  CreateBrandResType,
  GetBrandResType,
  GetBrandsResType,
  UpdateBrandBodyType,
  UpdateBrandResType,
} from 'src/routes/brand/brand.schema'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepo) {}

  async createBrand({ body, userId }: { body: CreateBrandBodyType; userId: number }): Promise<CreateBrandResType> {
    try {
      const result = await this.brandRepo.create({
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistException
      }
      throw error
    }
  }

  async getBrands(query: PaginationQueryType): Promise<GetBrandsResType> {
    const { brands, totalBrands } = await this.brandRepo.findMany({
      ...query,
      languageId: I18nContext.current()?.lang as string,
    })
    return {
      data: brands,
      totalItems: totalBrands,
    }
  }

  async getBrand(brandId: number): Promise<GetBrandResType> {
    const brand = await this.brandRepo.findUnique({
      where: { id: brandId },
      languageId: I18nContext.current()?.lang as string,
    })
    if (!brand) {
      throw BrandNotFoundException
    }
    return brand
  }

  async updateBrand({
    body,
    updatedById,
    brandId,
  }: {
    body: UpdateBrandBodyType
    updatedById: number
    brandId: number
  }): Promise<UpdateBrandResType> {
    try {
      const updatedBrand = await this.brandRepo.update({
        brandId,
        data: body,
        updatedById,
      })
      return updatedBrand
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistException
      }
      throw error
    }
  }

  async deleteBrand(brandId: number): Promise<MessageResType> {
    await this.brandRepo.delete({
      brandId,
    })
    return {
      message: 'Success.DeletedBrand',
    }
  }
}
