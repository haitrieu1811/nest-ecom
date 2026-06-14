import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const AddressNotFoundException = new NotFoundException('Error.AddressNotFound')

export const AddressNotOwnerException = new ForbiddenException('Error.AddressNotOwner')

export const LocationNotFoundException = new UnprocessableEntityException([
  {
    path: 'provinceCode',
    message: 'Error.ProvinceNotFound',
  },
  {
    path: 'wardCode',
    message: 'Error.WardNotFound',
  },
])
