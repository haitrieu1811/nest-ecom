import { UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Email đã tồn tại trên hệ thống.',
  },
])
