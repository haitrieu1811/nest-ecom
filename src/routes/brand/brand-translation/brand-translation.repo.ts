import { Injectable } from '@nestjs/common'

import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { BrandTranslationType } from 'src/shared/schemas/shared-brand-translation.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

type BrandTranslationUniqueObject =
  | {
      id: number
    }
  | {
      languageId_brandId: {
        languageId: string
        brandId: number
      }
    }

@Injectable()
@SerializeAll()
export class BrandTranslationRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, userId }: { data: CreateBrandTranslationBodyType; userId: number }): Promise<BrandTranslationType> {
    return this.prisma.brandTranslation.create({
      data: {
        ...data,
        createdById: userId,
      },
    }) as any
  }

  findUnique(where: BrandTranslationUniqueObject): Promise<BrandTranslationType | null> {
    return this.prisma.brandTranslation.findUnique({
      where: { ...where, deletedAt: null },
    }) as any
  }

  update({
    where,
    data,
    updatedById,
  }: {
    where: BrandTranslationUniqueObject
    data: UpdateBrandTranslationBodyType
    updatedById: number
  }): Promise<BrandTranslationType> {
    return this.prisma.brandTranslation.update({
      where: { ...where, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    }) as any
  }

  delete({ where, isHard }: { where: BrandTranslationUniqueObject; isHard?: boolean }) {
    return isHard
      ? this.prisma.brandTranslation.delete({
          where,
        })
      : this.prisma.brandTranslation.update({
          where: { ...where, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
