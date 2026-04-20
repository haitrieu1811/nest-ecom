import { Injectable } from '@nestjs/common'

import { BrandIncludeTranslationsType, CreateBrandBodyType, UpdateBrandBodyType } from 'src/routes/brand/brand.schema'
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/utils.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { BrandType } from 'src/shared/schemas/shared-brand.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

type BrandWhereUniqueObject = {
  id: number
}

@Injectable()
@SerializeAll()
export class BrandRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, userId }: { data: CreateBrandBodyType; userId: number }): Promise<BrandType> {
    return this.prisma.brand.create({
      data: {
        ...data,
        createdById: userId,
      },
    }) as any
  }

  async findMany({ page, limit, languageId }: PaginationQueryType & { languageId: string }): Promise<{
    brands: BrandIncludeTranslationsType[]
    totalBrands: number
  }> {
    const [brands, totalBrands] = await Promise.all([
      this.prisma.brand.findMany({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          brandTranslations: {
            where:
              languageId === ALL_LANGUAGES_CODE
                ? {
                    deletedAt: null,
                  }
                : { languageId, deletedAt: null },
          },
        },
      }) as any,
      this.prisma.brand.count({ where: { deletedAt: null } }),
    ])
    return {
      brands,
      totalBrands,
    }
  }

  findUnique({
    where,
    languageId,
  }: {
    where: BrandWhereUniqueObject
    languageId: string
  }): Promise<BrandIncludeTranslationsType | null> {
    return this.prisma.brand.findUnique({
      where: {
        ...where,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    }) as any
  }

  update({
    brandId,
    data,
    updatedById,
  }: {
    brandId: number
    data: UpdateBrandBodyType
    updatedById: number
  }): Promise<BrandType> {
    return this.prisma.brand.update({
      where: { id: brandId, deletedAt: null },
      data: {
        ...data,
        updatedById: updatedById,
      },
    }) as any
  }

  delete({ brandId, isHard }: { brandId: number; isHard?: boolean }) {
    return isHard
      ? this.prisma.brand.delete({
          where: { id: brandId },
        })
      : this.prisma.brand.update({
          where: { id: brandId, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
