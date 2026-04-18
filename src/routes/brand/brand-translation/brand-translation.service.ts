import { ForbiddenException, Injectable } from '@nestjs/common'

import {
  BrandOrLanuageNotFoundException,
  BrandTranslationAlreadyExistException,
  BrandTranslationNotFoundException,
} from 'src/routes/brand/brand-translation/brand-translation.error'
import { BrandTranslationRepo } from 'src/routes/brand/brand-translation/brand-translation.repo'
import {
  CreateBrandTranslationBodyType,
  CreateBrandTranslationResType,
  GetBrandTranslationResType,
  UpdateBrandTranslationBodyType,
  UpdateBrandTranslationResType,
} from 'src/routes/brand/brand-translation/brand-translation.schema'
import { isForeignKeyConstraintPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class BrandTranslationService {
  constructor(
    private readonly brandTranslationRepo: BrandTranslationRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
  ) {}

  private async validateAuthorOrAdmin({
    brandTranslationId,
    userId,
    agentRoleId,
  }: {
    brandTranslationId: number
    userId: number
    agentRoleId: number
  }): Promise<boolean> {
    const [brandTranslation, adminRoleId] = await Promise.all([
      this.brandTranslationRepo.findUnique(brandTranslationId),
      this.sharedRoleRepo.getAdminRoleId(),
    ])
    if (!brandTranslation) {
      throw BrandTranslationNotFoundException
    }
    if (agentRoleId === adminRoleId) {
      return true
    }
    if (brandTranslation.createdById !== userId) {
      throw new ForbiddenException()
    }
    return true
  }

  async createBrandTranslation({
    body,
    userId,
  }: {
    body: CreateBrandTranslationBodyType
    userId: number
  }): Promise<CreateBrandTranslationResType> {
    try {
      const result = await this.brandTranslationRepo.create({
        data: body,
        userId,
      })
      return result
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw BrandOrLanuageNotFoundException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistException
      }
      throw error
    }
  }

  async getBrandTranslation(brandTranslationId: number): Promise<GetBrandTranslationResType> {
    const brandTranslation = await this.brandTranslationRepo.findUnique(brandTranslationId)
    if (!brandTranslation) {
      throw BrandTranslationNotFoundException
    }
    return brandTranslation
  }

  async updateBrandTranslation({
    body,
    brandTranslationId,
    userId,
    agentRoleId,
  }: {
    body: UpdateBrandTranslationBodyType
    brandTranslationId: number
    userId: number
    agentRoleId: number
  }): Promise<UpdateBrandTranslationResType> {
    try {
      // Chỉ người tạo hoặc admin mới được phép cập nhật brand translation
      await this.validateAuthorOrAdmin({
        brandTranslationId,
        userId,
        agentRoleId,
      })
      const updatedBrandTranslation = await this.brandTranslationRepo.update({
        brandTranslationId,
        data: body,
        updatedById: userId,
      })
      return updatedBrandTranslation
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistException
      }
      throw error
    }
  }

  async deleteBrandTranslation({
    brandTranslationId,
    userId,
    agentRoleId,
  }: {
    brandTranslationId: number
    userId: number
    agentRoleId: number
  }): Promise<MessageResType> {
    // Chỉ người tạo hoặc admin mới được phép xóa brand translation
    await this.validateAuthorOrAdmin({
      brandTranslationId,
      userId,
      agentRoleId,
    })
    await this.brandTranslationRepo.delete({
      brandTranslationId,
    })
    return {
      message: 'Success.DeletedBrandTranslation',
    }
  }
}
