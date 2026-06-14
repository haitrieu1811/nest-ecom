import z from 'zod'

import { ProvinceSchema, WardSchema } from 'src/routes/location/location.schema'
import { PHONE_NUMBER_REGEX } from 'src/shared/constants/regex'

export const AddressSchema = z
  .object({
    id: z.int().positive(),
    contactName: z
      .string('Error.AddressContactNameMustBeAString')
      .min(1, 'Error.AddressContactNameIsRequired')
      .max(100, 'Error.AddressContactNameIsTooLong'),
    phoneNumber: z
      .string('Error.AddressPhoneNumberMustBeAString')
      .min(1, 'Error.AddressPhoneNumberIsRequired')
      .max(15, 'Error.AddressPhoneNumberIsTooLong')
      .regex(PHONE_NUMBER_REGEX, 'Error.AddressPhoneNumberMustBeNumeric'),
    streetDetail: z
      .string('Error.AddressStreetDetailMustBeAString')
      .min(1, 'Error.AddressStreetDetailIsRequired')
      .max(200, 'Error.AddressStreetDetailIsTooLong'),
    isDefault: z.boolean('Error.AddressIsDefaultMustBeABoolean'),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    userId: z.int().positive(),
    provinceCode: z.int('Error.AddressProvinceCodeMustBeANumber').positive('Error.AddressProvinceCodeMustBePositive'),
    wardCode: z.int('Error.AddressWardCodeMustBeANumber').positive('Error.AddressWardCodeMustBePositive'),
  })
  .strict()

export const AddressIncludeLocationSchema = AddressSchema.extend({
  province: ProvinceSchema,
  ward: WardSchema,
})

// Create
export const CreateAddressBodySchema = AddressSchema.pick({
  contactName: true,
  phoneNumber: true,
  streetDetail: true,
  isDefault: true,
  provinceCode: true,
  wardCode: true,
}).strict()

export const CreateAddressResSchema = AddressIncludeLocationSchema

// Update
export const UpdateAddressBodySchema = CreateAddressBodySchema.strict()

export const UpdateAddressResSchema = AddressIncludeLocationSchema

// Param
export const AddressIdParamSchema = z
  .object({
    addressId: z.coerce
      .number('Error.AddressIdMustBeANumber')
      .int('Error.AddressIdMustBeAnInteger')
      .positive('Error.AddressIdMustBePositive'),
  })
  .strict()

// Get list
export const GetAddressesResSchema = z.object({
  data: z.array(AddressIncludeLocationSchema),
  totalAddresses: z.number().int().nonnegative(),
})

// Get detail
export const GetAddressResSchema = AddressIncludeLocationSchema

// Types
export type AddressType = z.infer<typeof AddressSchema>
export type AddressIncludeLocationType = z.infer<typeof AddressIncludeLocationSchema>
export type CreateAddressBodyType = z.infer<typeof CreateAddressBodySchema>
export type CreateAddressResType = z.infer<typeof CreateAddressResSchema>
export type UpdateAddressBodyType = z.infer<typeof UpdateAddressBodySchema>
export type UpdateAddressResType = z.infer<typeof UpdateAddressResSchema>
export type AddressIdParamType = z.infer<typeof AddressIdParamSchema>
export type GetAddressesResType = z.infer<typeof GetAddressesResSchema>
export type GetAddressResType = z.infer<typeof GetAddressResSchema>
