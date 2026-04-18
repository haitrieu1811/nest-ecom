import { Injectable } from '@nestjs/common'

import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType,
} from 'src/routes/brand/brand-translation/brand-translation.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { BrandTranslationType } from 'src/shared/schemas/shared-brand-translation.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

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

  findUnique(brandTranslationId: number): Promise<BrandTranslationType | null> {
    return this.prisma.brandTranslation.findUnique({
      where: { id: brandTranslationId, deletedAt: null },
    }) as any
  }

  update({
    brandTranslationId,
    data,
    updatedById,
  }: {
    brandTranslationId: number
    data: UpdateBrandTranslationBodyType
    updatedById: number
  }): Promise<BrandTranslationType> {
    return this.prisma.brandTranslation.update({
      where: { id: brandTranslationId, deletedAt: null },
      data: {
        ...data,
        updatedById,
      },
    }) as any
  }

  delete({ brandTranslationId, isHard }: { brandTranslationId: number; isHard?: boolean }) {
    return isHard
      ? this.prisma.brandTranslation.delete({
          where: { id: brandTranslationId },
        })
      : this.prisma.brandTranslation.update({
          where: { id: brandTranslationId, deletedAt: null },
          data: { deletedAt: new Date() },
        })
  }
}
