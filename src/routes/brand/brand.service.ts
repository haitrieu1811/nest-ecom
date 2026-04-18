import { Injectable } from '@nestjs/common'

import {
  BrandAlreadyExistException,
  BrandNotAuthorOrAdminException,
  BrandNotFoundException,
} from 'src/routes/brand/brand.error'
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
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepo: BrandRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
  ) {}

  private async validateAuthorOrAdmin({
    brandId,
    userId,
    agentRoleId,
  }: {
    brandId: number
    userId: number
    agentRoleId: number
  }): Promise<boolean> {
    const [brand, adminRoleId] = await Promise.all([
      this.brandRepo.findUnique({
        id: brandId,
      }),
      this.sharedRoleRepo.getAdminRoleId(),
    ])
    if (!brand) {
      throw BrandNotFoundException
    }
    if (agentRoleId === adminRoleId) {
      return true
    }
    if (brand.createdById !== userId) {
      throw BrandNotAuthorOrAdminException
    }
    return true
  }

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
    const { brands, totalBrands } = await this.brandRepo.findMany(query)
    return {
      data: brands,
      pagination: {
        ...query,
        totalRows: totalBrands,
        totalPages: Math.ceil(totalBrands / query.limit),
      },
    }
  }

  async getBrand(brandId: number): Promise<GetBrandResType> {
    const brand = await this.brandRepo.findUnique({
      id: brandId,
    })
    if (!brand) {
      throw BrandNotFoundException
    }
    return brand
  }

  async updateBrand({
    body,
    userId,
    brandId,
    agentRoleId,
  }: {
    body: UpdateBrandBodyType
    userId: number
    brandId: number
    agentRoleId: number
  }): Promise<UpdateBrandResType> {
    try {
      // Chỉ người tạo brand hoặc admin mới được phép cập nhật brand đó
      await this.validateAuthorOrAdmin({ brandId, userId, agentRoleId })
      const updatedBrand = await this.brandRepo.update({
        brandId,
        data: body,
        updatedById: userId,
      })
      return updatedBrand
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandAlreadyExistException
      }
      throw error
    }
  }

  async deleteBrand({
    brandId,
    userId,
    agentRoleId,
  }: {
    brandId: number
    userId: number
    agentRoleId: number
  }): Promise<MessageResType> {
    // Chỉ người tạo brand hoặc admin mới được phép xóa brand đó
    await this.validateAuthorOrAdmin({ brandId, userId, agentRoleId })
    await this.brandRepo.delete({
      brandId,
    })
    return {
      message: 'Success.DeletedBrand',
    }
  }
}
