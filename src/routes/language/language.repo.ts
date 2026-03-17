import { Injectable } from '@nestjs/common'

import {
  CreateLanguageResType,
  GetLanguageResType,
  LanguageType,
  UpdateLanguageResType,
} from 'src/routes/language/language.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class LanguageRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({
    data,
    userId,
  }: {
    data: Pick<LanguageType, 'id' | 'name'>
    userId: number
  }): Promise<CreateLanguageResType> {
    return this.prisma.language.create({
      data: {
        ...data,
        createdById: userId,
        updatedById: userId,
      },
    }) as any
  }

  findMany(): Promise<LanguageType[]> {
    return this.prisma.language.findMany({
      where: {
        deletedAt: null,
      },
    }) as any
  }

  count(): Promise<number> {
    return this.prisma.language.count({
      where: {
        deletedAt: null,
      },
    })
  }

  findUnique(uniqueObject: { id: string }): Promise<GetLanguageResType> {
    return this.prisma.language.findUnique({
      where: {
        ...uniqueObject,
        deletedAt: null,
      },
    }) as any
  }

  update({
    where,
    data,
  }: {
    where: { id: string }
    data: Partial<Pick<LanguageType, 'name' | 'updatedById' | 'deletedAt' | 'deletedById'>>
  }): Promise<UpdateLanguageResType> {
    return this.prisma.language.update({
      where,
      data,
    }) as any
  }

  delete({ where, isHard = false, userId }: { where: { id: string }; isHard?: boolean; userId: number }) {
    return !isHard
      ? this.prisma.language.update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById: userId,
          },
        })
      : this.prisma.language.delete({
          where,
        })
  }
}
