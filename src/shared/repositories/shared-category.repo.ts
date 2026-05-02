import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedCategoryRepo {
  constructor(private readonly prisma: PrismaService) {}

  findMany(categoryIds: number[]) {
    return this.prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
        deletedAt: null,
      },
    })
  }
}
