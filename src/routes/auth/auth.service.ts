import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import ms from 'ms'

import { addMilliseconds } from 'date-fns'
import { EmailAlreadyExistException } from 'src/routes/auth/auth.error'
import { AuthRepo } from 'src/routes/auth/auth.repo'
import { RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.schema'
import envConfig from 'src/shared/config'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'
import { generateOTP } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly sharedUserRepo: SharedUserRepo,
  ) {}

  async register({ data, roleId }: { data: RegisterBodyType; roleId: number }) {
    // Kiểm tra email đã tồn tại trên hệ thống hay chưa
    const user = await this.sharedUserRepo.findUnique({
      email: data.email,
    })
    if (user) {
      throw EmailAlreadyExistException
    }
    // Kiểm tra OTP
    const verificationCode = await this.authRepo.findFirstVerificationCode({
      email: data.email,
      code: data.code,
      type: VerificationCodeType.REGISTER,
    })
    if (!verificationCode) {
      throw new UnprocessableEntityException([
        {
          path: 'code',
          message: 'OTP không hợp lệ.',
        },
      ])
    }
    if (new Date(verificationCode.expiresAt) < new Date()) {
      throw new UnprocessableEntityException([
        {
          path: 'code',
          message: 'OTP đã hết hạn.',
        },
      ])
    }
    // Tạo người dùng mới
    const newUser = await this.authRepo.createUser({
      data: {
        email: data.email,
        password: data.password,
      },
      roleId,
    })
    return newUser
  }

  async registerClient(data: RegisterBodyType) {
    const clientRoleId = await this.sharedRoleRepo.getClientRoleId()
    return this.register({
      data,
      roleId: clientRoleId,
    })
  }

  async sendOTP(data: SendOTPBodyType) {
    // Kiểm tra email đã tồn tại trên hệ thống hay chưa
    const user = await this.sharedUserRepo.findUnique({
      email: data.email,
    })
    if (user) {
      throw EmailAlreadyExistException
    }
    // Tạo mã OTP
    const otp = generateOTP()
    const verificationCode = await this.authRepo.createVerificationCode({
      email: data.email,
      type: data.type,
      code: otp,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as ms.StringValue)).toISOString(),
    })
    return verificationCode
  }
}
