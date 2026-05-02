import { Injectable } from '@nestjs/common'

import { BrandWhereUniqueInput } from 'generated/prisma/internal/prismaNamespaceBrowser'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedBrandRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(where: BrandWhereUniqueInput) {
    return this.prisma.brand.findUnique({
      where,
    })
  }
}
