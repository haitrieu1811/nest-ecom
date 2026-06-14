import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  AddressIdParamDTO,
  CreateAddressBodyDTO,
  CreateAddressResDTO,
  GetAddressesResDTO,
  GetAddressResDTO,
  UpdateAddressBodyDTO,
  UpdateAddressResDTO,
} from 'src/routes/location/address/address.dto'
import { AddressService } from 'src/routes/location/address/address.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ZodResponse({ type: CreateAddressResDTO })
  createAddress(@Body() body: CreateAddressBodyDTO, @ActiveUser('userId') userId: number) {
    return this.addressService.createAddress({ body, userId })
  }

  @Get()
  @ZodResponse({ type: GetAddressesResDTO })
  getAddresses(@ActiveUser('userId') userId: number) {
    return this.addressService.getAddresses(userId)
  }

  @Get(':addressId')
  @ZodResponse({ type: GetAddressResDTO })
  getAddress(@Param() param: AddressIdParamDTO, @ActiveUser('userId') userId: number) {
    return this.addressService.getAddress({ addressId: param.addressId, userId })
  }

  @Put(':addressId')
  @ZodResponse({ type: UpdateAddressResDTO })
  updateAddress(
    @Body() body: UpdateAddressBodyDTO,
    @Param() param: AddressIdParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.addressService.updateAddress({ addressId: param.addressId, userId, body })
  }

  @Delete(':addressId')
  @ZodResponse({ type: MessageResDTO })
  deleteAddress(@Param() param: AddressIdParamDTO, @ActiveUser('userId') userId: number) {
    return this.addressService.deleteAddress({ addressId: param.addressId, userId })
  }
}
