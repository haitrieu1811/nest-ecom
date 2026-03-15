import { BadRequestException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'

export const EmailAlreadyExistException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Error.EmailAlreadyExist',
  },
])

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    path: 'email',
    message: 'Error.EmailNotFound',
  },
])

export const IncorrectPasswordException = new UnprocessableEntityException([
  {
    path: 'password',
    message: 'Error.IncorrectPassword',
  },
])

export const RefreshTokenNotExistException = new UnauthorizedException('Error.RefreshTokenNotExist')

export const InvalidOtpException = new UnprocessableEntityException([
  {
    path: 'code',
    message: 'Error.InvalidOtpCode',
  },
])

export const ExpiredOtpException = new UnprocessableEntityException([
  {
    path: 'code',
    message: 'Error.ExpiredOtp',
  },
])

export const SendOtpFailException = new UnprocessableEntityException([
  {
    path: 'code',
    message: 'Error.SendOtpFail',
  },
])

export const TwoFactorAuthAlreadySetUpException = new BadRequestException('Error.TwoFactorAuthAlreadySetUp')
