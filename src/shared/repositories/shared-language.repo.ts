import { Injectable } from '@nestjs/common'

import { LanguageWhereUniqueInput } from 'generated/prisma/models'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedLanguageRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(where: LanguageWhereUniqueInput) {
    return this.prisma.language.findUnique({
      where,
    })
  }
}
