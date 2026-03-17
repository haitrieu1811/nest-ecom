import { NotFoundException, UnprocessableEntityException } from '@nestjs/common'

export const PermissionAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'path',
    message: 'Error.PermissionAlreadyExist',
  },
  {
    path: 'method',
    message: 'Error.PermissionAlreadyExist',
  },
])

export const PermissionNotFoundException = new NotFoundException('Error.PermissionNotFound')
