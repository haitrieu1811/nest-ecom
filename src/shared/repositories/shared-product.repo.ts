import { Injectable } from '@nestjs/common'

import { ProductWhereUniqueInput } from 'generated/prisma/models'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(where: ProductWhereUniqueInput) {
    return this.prisma.product.findUnique({
      where,
    })
  }
}
