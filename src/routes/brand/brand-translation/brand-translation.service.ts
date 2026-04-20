import { Injectable } from '@nestjs/common'

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
    const brandTranslation = await this.brandTranslationRepo.findUnique({
      id: brandTranslationId,
    })
    if (!brandTranslation) {
      throw BrandTranslationNotFoundException
    }
    return brandTranslation
  }

  async updateBrandTranslation({
    body,
    brandTranslationId,
    updatedById,
  }: {
    body: UpdateBrandTranslationBodyType
    brandTranslationId: number
    updatedById: number
  }): Promise<UpdateBrandTranslationResType> {
    try {
      const updatedBrandTranslation = await this.brandTranslationRepo.update({
        where: { id: brandTranslationId },
        data: body,
        updatedById,
      })
      return updatedBrandTranslation
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistException
      }
      throw error
    }
  }

  async deleteBrandTranslation(brandTranslationId: number): Promise<MessageResType> {
    await this.brandTranslationRepo.delete({
      where: { id: brandTranslationId },
    })
    return {
      message: 'Success.DeletedBrandTranslation',
    }
  }
}
