import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { JsonWebTokenError } from '@nestjs/jwt'
import { addMilliseconds } from 'date-fns'
import omit from 'lodash/omit'
import ms from 'ms'

import {
  EmailAlreadyExistException,
  EmailNotFoundException,
  IncorrectPasswordException,
  RefreshTokenNotExistException,
} from 'src/routes/auth/auth.error'
import { AuthRepo } from 'src/routes/auth/auth.repo'
import {
  LoginBodyType,
  LoginResTyoe,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  SendOTPBodyType,
} from 'src/routes/auth/auth.schema'
import envConfig from 'src/shared/config'
import { VerificationCodeType } from 'src/shared/constants/auth.constant'
import { generateOTP } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadInput, RefreshTokenPayloadInput } from 'src/shared/types/utils.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly emailService: EmailService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  private async signTokens({
    refreshTokenExp,
    ...payload
  }: AccessTokenPayloadInput & RefreshTokenPayloadInput & { refreshTokenExp?: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken({ ...payload, exp: refreshTokenExp }),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepo.createRefreshToken({
      deviceId: payload.deviceId,
      token: refreshToken,
      userId: decodedRefreshToken.userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000).toISOString(),
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async register({
    data,
    roleId,
    ip,
    userAgent,
  }: {
    data: RegisterBodyType
    roleId: number
    ip: string
    userAgent: string
  }): Promise<RegisterResType> {
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
    // Tạo user mới, device mới trả về user và tokens
    const newUser = await this.authRepo.createUser({
      data: {
        email: data.email,
        password: data.password,
      },
      roleId,
    })
    const device = await this.authRepo.createDevice({
      ip,
      userAgent,
      userId: newUser.id,
    })
    const { accessToken, refreshToken } = await this.signTokens({
      userId: newUser.id,
      roleId: newUser.roleId,
      deviceId: device.id,
    })
    return {
      accessToken,
      refreshToken,
      user: newUser,
    }
  }

  async registerClient({ data, ip, userAgent }: { data: RegisterBodyType; ip: string; userAgent: string }) {
    const clientRoleId = await this.sharedRoleRepo.getClientRoleId()
    return this.register({
      data,
      roleId: clientRoleId,
      ip,
      userAgent,
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
    // Gửi mail
    const { error } = await this.emailService.sendOTP({
      otp,
      email: data.email,
      title: 'Xác thực email của bạn',
      description: 'Nhập mã bên dưới để hoàn tất đăng ký tài khoản.',
    })
    if (error) {
      throw new UnprocessableEntityException([
        {
          path: 'code',
          message: 'Gửi mã OTP thất bại.',
        },
      ])
    }
    return verificationCode
  }

  async login({ data, ip, userAgent }: { data: LoginBodyType; ip: string; userAgent: string }): Promise<LoginResTyoe> {
    // Kiểm tra email có tồn tại trên hệ thống không
    const user = await this.sharedUserRepo.findUnique({
      email: data.email,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // Kiểm tra mật khẩu có đúng không
    const isCorrectPassword = await this.hashingService.compare(data.password, user.password)
    if (!isCorrectPassword) {
      throw IncorrectPasswordException
    }
    // Tạo thiết bị đăng nhập mới
    const device = await this.authRepo.createDevice({
      ip,
      userAgent,
      userId: user.id,
    })
    // Tạo token và trả về thông tin user
    const configuredUser = omit(user, ['password', 'totpSecret', 'deletedAt', 'createdById', 'updatedById'])
    const { accessToken, refreshToken } = await this.signTokens({
      userId: user.id,
      roleId: user.roleId,
      deviceId: device.id,
    })
    return { accessToken, refreshToken, user: configuredUser }
  }

  async refreshToken({
    bodyRefreshToken,
    ip,
    userAgent,
  }: {
    bodyRefreshToken: string
    ip: string
    userAgent: string
  }): Promise<RefreshTokenResType> {
    try {
      // Kiểm tra refresh token có hợp lệ không bằng phương thức verify của JWT
      const decodedRefreshToken = await this.tokenService.verifyRefreshToken(bodyRefreshToken)
      // Kiểm tra refresh token có tồn tại trong DB không
      const dbRefreshToken = await this.authRepo.findUniqueRefreshTokenIncludeUserAndDevice(bodyRefreshToken)
      if (!dbRefreshToken) {
        throw RefreshTokenNotExistException
      }
      // Tạo access token và refresh token mới
      const $tokens = this.signTokens({
        userId: dbRefreshToken.userId,
        roleId: dbRefreshToken.user.roleId,
        deviceId: dbRefreshToken.deviceId,
        refreshTokenExp: decodedRefreshToken.exp, // thời gian hết hạn của RT cũ
      })
      // Xóa refresh token cũ
      const $deleteRefreshToken = this.authRepo.deleteRefreshToken(bodyRefreshToken)
      // Cập nhật device
      const $updateRefreshToken = this.authRepo.updateDevice({
        deviceId: dbRefreshToken.deviceId,
        data: {
          ip,
          userAgent,
        },
      })
      const [{ accessToken, refreshToken }] = await Promise.all([$tokens, $deleteRefreshToken, $updateRefreshToken])
      // Trả về client access token và refresh token mới
      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message)
      }
      throw error
    }
  }
}
