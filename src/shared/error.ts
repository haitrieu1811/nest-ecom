import { ForbiddenException, NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const PermissionNotFoundException = new NotFoundException('Error.PermissionNotFound')

export const EmailAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Error.EmailAlreadyExist',
  },
])

export const RoleNotFoundException = new NotFoundException('Error.RoleNotFound')

export const PhoneNumberAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'phoneNumber',
    message: 'Error.PhoneNumberAlreadyExist',
  },
])

export const OnlyAdminActionException = new ForbiddenException('Error.OnlyAdminAction')

export const BrandNotFoundException = new UnprocessableEntityException([
  {
    path: 'brandId',
    message: 'Error.BrandNotFound',
  },
])

export const LanguageNotFoundException = new NotFoundException('Error.LanguageNotFound')

export const ProductNotFoundException = new NotFoundException('Error.ProductNotFound')

export const PrivilegeException = new ForbiddenException('Error.CannotAccessBecauseOfPrivilege')
