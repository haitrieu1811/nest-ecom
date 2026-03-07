import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Email đã tồn tại trên hệ thống.',
  },
])

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Không tìm thấy email trên hệ thống.',
  },
])

export const IncorrectPasswordException = new UnprocessableEntityException([
  {
    path: 'password',
    message: 'Mật khẩu không chính xác.',
  },
])

export const RefreshTokenNotExistException = new UnauthorizedException('Refresh token không tồn tại.')
