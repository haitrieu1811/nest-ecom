import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const RoleAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'name',
    message: 'Error.RoleAlreadyExist',
  },
])

export const RoleNotFoundException = new NotFoundException('Error.RoleNotFound')

export const RoleOrPermissionNotFoundException = new NotFoundException('Error.RoleOrPermissionNotFound')
