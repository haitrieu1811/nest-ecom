import { Injectable } from '@nestjs/common'

import { ProvinceType, WardType } from 'src/routes/location/location.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class LocationRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAllProvinces(): Promise<ProvinceType[]> {
    return this.prisma.province.findMany({
      orderBy: { name: 'asc' },
    }) as any
  }

  findWardsByProvinceCode(provinceCode: number): Promise<WardType[]> {
    return this.prisma.ward.findMany({
      where: { provinceCode },
      orderBy: { name: 'asc' },
    }) as any
  }
}
