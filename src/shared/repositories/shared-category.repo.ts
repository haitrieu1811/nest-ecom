import { Injectable } from '@nestjs/common'

import { CategoryWhereUniqueInput } from 'generated/prisma/models'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedCategoryRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(where: CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where,
    })
  }
}
