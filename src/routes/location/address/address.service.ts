import { Injectable } from '@nestjs/common'

import {
  AddressNotFoundException,
  AddressNotOwnerException,
  LocationNotFoundException,
} from 'src/routes/location/address/address.error'
import { AddressRepo } from 'src/routes/location/address/address.repo'
import {
  AddressIncludeLocationType,
  CreateAddressBodyType,
  CreateAddressResType,
  GetAddressesResType,
  GetAddressResType,
  UpdateAddressBodyType,
  UpdateAddressResType,
} from 'src/routes/location/address/address.schema'
import { isForeignKeyConstraintPrismaError } from 'src/shared/helpers'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressRepo) {}

  private async validateOwnership({
    addressId,
    userIdAgent,
  }: {
    addressId: number
    userIdAgent: number
  }): Promise<AddressIncludeLocationType> {
    const address = await this.addressRepo.findByIdWithoutOwnerCheck(addressId)
    if (!address) {
      throw AddressNotFoundException
    }
    if (address.userId !== userIdAgent) {
      throw AddressNotOwnerException
    }
    return address
  }

  async createAddress({
    body,
    userId,
  }: {
    body: CreateAddressBodyType
    userId: number
  }): Promise<CreateAddressResType> {
    if (body.isDefault) {
      await this.addressRepo.resetDefault(userId)
    }
    try {
      const address = await this.addressRepo.create({ data: body, userId })
      return address
    } catch (error) {
      // Kiểm tra nếu nhập một provinceCode, wardCode không tồn tại trong DB thì throw error chi tiết đến người dùng
      if (isForeignKeyConstraintPrismaError(error)) {
        throw LocationNotFoundException
      }
      throw error
    }
  }

  getAddresses(userId: number): Promise<GetAddressesResType> {
    return this.addressRepo.findMany(userId)
  }

  async getAddress({ addressId, userId }: { addressId: number; userId: number }): Promise<GetAddressResType> {
    return this.validateOwnership({ addressId, userIdAgent: userId })
  }

  async updateAddress({
    addressId,
    userId,
    body,
  }: {
    addressId: number
    userId: number
    body: UpdateAddressBodyType
  }): Promise<UpdateAddressResType> {
    await this.validateOwnership({ addressId, userIdAgent: userId })
    if (body.isDefault) {
      await this.addressRepo.resetDefault(userId)
    }
    const updatedAddress = await this.addressRepo.update({ addressId, userId, data: body })
    return updatedAddress
  }

  async deleteAddress({ addressId, userId }: { addressId: number; userId: number }): Promise<MessageResType> {
    await this.validateOwnership({ addressId, userIdAgent: userId })
    await this.addressRepo.delete({ addressId, userId })
    return { message: 'Success.DeletedAddress' }
  }
}
