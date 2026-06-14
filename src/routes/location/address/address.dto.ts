import { createZodDto } from 'nestjs-zod'

import {
  AddressIdParamSchema,
  CreateAddressBodySchema,
  CreateAddressResSchema,
  GetAddressesResSchema,
  GetAddressResSchema,
  UpdateAddressBodySchema,
  UpdateAddressResSchema,
} from 'src/routes/location/address/address.schema'

export class CreateAddressBodyDTO extends createZodDto(CreateAddressBodySchema) {}
export class CreateAddressResDTO extends createZodDto(CreateAddressResSchema) {}
export class UpdateAddressBodyDTO extends createZodDto(UpdateAddressBodySchema) {}
export class UpdateAddressResDTO extends createZodDto(UpdateAddressResSchema) {}
export class AddressIdParamDTO extends createZodDto(AddressIdParamSchema) {}
export class GetAddressesResDTO extends createZodDto(GetAddressesResSchema) {}
export class GetAddressResDTO extends createZodDto(GetAddressResSchema) {}
