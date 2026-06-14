import { Injectable } from '@nestjs/common'

import {
  AddressIncludeLocationType,
  CreateAddressBodyType,
  GetAddressesResType,
  UpdateAddressBodyType,
} from 'src/routes/location/address/address.schema'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

const addressIncludeLocation = {
  province: true,
  ward: true,
}

@Injectable()
@SerializeAll()
export class AddressRepo {
  constructor(private readonly prisma: PrismaService) {}

  create({ data, userId }: { data: CreateAddressBodyType; userId: number }): Promise<AddressIncludeLocationType> {
    return this.prisma.address.create({
      data: {
        ...data,
        userId,
      },
      include: addressIncludeLocation,
    }) as any
  }

  async findMany(userId: number): Promise<GetAddressesResType> {
    const [data, totalAddresses] = await Promise.all([
      this.prisma.address.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        include: addressIncludeLocation,
      }) as any,
      this.prisma.address.count({ where: { userId, deletedAt: null } }),
    ])
    return { data, totalAddresses } as any
  }

  findById({ addressId, userId }: { addressId: number; userId: number }): Promise<AddressIncludeLocationType | null> {
    return this.prisma.address.findFirst({
      where: { id: addressId, userId, deletedAt: null },
      include: addressIncludeLocation,
    }) as any
  }

  findByIdWithoutOwnerCheck(addressId: number): Promise<AddressIncludeLocationType | null> {
    return this.prisma.address.findFirst({
      where: { id: addressId, deletedAt: null },
      include: addressIncludeLocation,
    }) as any
  }

  update({
    addressId,
    userId,
    data,
  }: {
    addressId: number
    userId: number
    data: UpdateAddressBodyType
  }): Promise<AddressIncludeLocationType> {
    return this.prisma.address.update({
      where: { id: addressId, userId, deletedAt: null },
      data,
      include: addressIncludeLocation,
    }) as any
  }

  delete({ addressId, userId }: { addressId: number; userId: number }) {
    return this.prisma.address.update({
      where: { id: addressId, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    })
  }

  resetDefault(userId: number) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true, deletedAt: null },
      data: { isDefault: false },
    })
  }
}
