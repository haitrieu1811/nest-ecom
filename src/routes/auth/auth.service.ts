import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError } from '@nestjs/jwt'
import { addMilliseconds } from 'date-fns'
import omit from 'lodash/omit'
import ms from 'ms'

import {
  EmailNotFoundException,
  ExpiredOtpException,
  IncorrectPasswordException,
  InvalidOtpException,
  InvalidTOTPCodeException,
  RefreshTokenNotExistException,
  SendOtpFailException,
  TOTPCodeOrCodeIsRequiredException,
  TwoFactorAuthAlreadyEnabledException,
  TwoFactorAuthNotEnabledException,
  UserBlockedException,
} from 'src/routes/auth/auth.error'
import { AuthRepo } from 'src/routes/auth/auth.repo'
import {
  Disable2FABodyType,
  Enable2FAResType,
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
  RegisterBodyType,
  RegisterResType,
  ResetPasswordBodyType,
  ResetPasswordResType,
  SendOTPBodyType,
} from 'src/routes/auth/auth.schema'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode, UserStatus, VerificationCodeType } from 'src/shared/constants/auth.constant'
import { EmailAlreadyExistException, RoleNotFoundException } from 'src/shared/error'
import { generateOTP } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'
import { TwoFactorAuthService } from 'src/shared/services/2fa.service'
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
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  async signTokens({
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

  async validateRefreshToken(token: string) {
    // Kiểm tra refresh token có hợp lệ không bằng phương thức verify của JWT
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(token)
    // Kiểm tra refresh token có tồn tại trong DB không
    const dbRefreshToken = await this.authRepo.findUniqueRefreshTokenIncludeUserAndDevice(token)
    if (!dbRefreshToken) {
      throw RefreshTokenNotExistException
    }
    return {
      decodedRefreshToken,
      dbRefreshToken,
    }
  }

  async validateVerificationCode({ email, code, type }: { email: string; code: string; type: TypeOfVerificationCode }) {
    const verificationCode = await this.authRepo.findUniqueVerificationCode({
      email_type: {
        email,
        type,
      },
    })
    if (!verificationCode || verificationCode.code !== code) {
      throw InvalidOtpException
    }
    if (new Date(verificationCode.expiresAt) < new Date()) {
      throw ExpiredOtpException
    }
    return verificationCode
  }

  async register({
    body,
    ip,
    userAgent,
  }: {
    body: RegisterBodyType
    ip: string
    userAgent: string
  }): Promise<RegisterResType> {
    // Kiểm tra email đã tồn tại trên hệ thống hay chưa
    const user = await this.sharedUserRepo.findUnique({
      email: body.email,
    })
    if (user) {
      throw EmailAlreadyExistException
    }
    // Kiểm tra roleId có tồn tại không
    const role = await this.sharedRoleRepo.findUnique({
      id: body.roleId,
    })
    if (!role) {
      throw RoleNotFoundException
    }
    // Kiểm tra OTP
    await this.validateVerificationCode({
      email: body.email,
      code: body.code,
      type: VerificationCodeType.REGISTER,
    })
    // Tạo user mới, device mới trả về user và tokens
    const hashedPassword = await this.hashingService.hash(body.password)
    const newUser = await this.authRepo.createUserIncludeRole({
      email: body.email,
      password: hashedPassword,
      roleId: body.roleId,
    })
    const device = await this.authRepo.createDevice({
      ip,
      userAgent,
      userId: newUser.id,
    })
    const [{ accessToken, refreshToken }] = await Promise.all([
      this.signTokens({
        userId: newUser.id,
        roleId: newUser.roleId,
        deviceId: device.id,
      }),
      this.authRepo.deleteVerificationCode({
        email_type: {
          email: body.email,
          type: VerificationCodeType.REGISTER,
        },
      }),
    ])
    return {
      accessToken,
      refreshToken,
      user: omit(newUser, ['password', 'totpSecret']),
    }
  }

  async sendOTP(body: SendOTPBodyType): Promise<MessageResType> {
    const user = await this.sharedUserRepo.findUnique({
      email: body.email,
    })
    if (body.type === 'REGISTER' && user) {
      throw EmailAlreadyExistException
    }
    if (
      [VerificationCodeType.LOGIN, VerificationCodeType.DISABLE_2FA, VerificationCodeType.FORGOT_PASSWORD].includes(
        body.type as any,
      ) &&
      !user
    ) {
      throw EmailNotFoundException
    }
    // Tạo mã OTP
    const otp = generateOTP()
    const $createVerificationCode = this.authRepo.createVerificationCode({
      email: body.email,
      type: body.type,
      code: otp,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as ms.StringValue)).toISOString(),
    })
    // Gửi mail
    let title: string = ''
    let description: string = ''
    switch (body.type) {
      case 'REGISTER':
        title = 'Xác thực email của bạn'
        description = 'Nhập mã bên dưới để hoàn tất đăng ký tài khoản.'
        break
      case 'FORGOT_PASSWORD':
        title = 'Đặt lại mật khẩu'
        description = 'Nhập mã bên dưới để hoàn tất đặt lại mật khẩu.'
        break
      case 'LOGIN':
        title = 'Xác thực đăng nhập'
        description = 'Nhập mã bên dưới để hoàn tất việc đăng nhập.'
        break
      case 'DISABLE_2FA':
        title = 'Tắt xác thực 2 bước'
        description = 'Nhập mã bên dưới để hoàn tất việc tắt chức năng xác thực 2 bước.'
        break
      default:
        break
    }
    const $sendMail = this.emailService.sendOTP({
      otp,
      email: body.email,
      title,
      description,
    })
    const [{ error }] = await Promise.all([$sendMail, $createVerificationCode])
    if (error) {
      throw SendOtpFailException
    }
    return {
      message: 'Gửi mã OTP thành công.',
    }
  }

  async login({ body, ip, userAgent }: { body: LoginBodyType; ip: string; userAgent: string }): Promise<LoginResType> {
    // Kiểm tra email có tồn tại trên hệ thống không
    const user = await this.authRepo.findUniqueUserIncludeRole({
      email: body.email,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // Kiểm tra mật khẩu có đúng không
    const isCorrectPassword = await this.hashingService.compare(body.password, user.password)
    if (!isCorrectPassword) {
      throw IncorrectPasswordException
    }
    // Kiểm tra user có bị block không
    if (user.status === UserStatus.BLOCKED) {
      throw UserBlockedException
    }
    // Nếu user đã bật 2FA thì kiểm tra code hoặc TOTP code
    if (user.totpSecret) {
      if (!body.totpCode && !body.code) {
        throw TOTPCodeOrCodeIsRequiredException
      }
      if (body.totpCode) {
        const isValid = this.twoFactorAuthService.verifyTOTP({
          email: body.email,
          secret: user.totpSecret,
          token: body.totpCode,
        })
        if (!isValid) {
          throw InvalidTOTPCodeException
        }
      } else if (body.code) {
        await this.validateVerificationCode({
          email: body.email,
          code: body.code,
          type: VerificationCodeType.LOGIN,
        })
      }
    }
    // Tạo thiết bị đăng nhập mới
    const device = await this.authRepo.createDevice({
      ip,
      userAgent,
      userId: user.id,
    })
    // Tạo token và trả về thông tin user
    const configuredUser = omit(user, ['password', 'totpSecret'])
    const { accessToken, refreshToken } = await this.signTokens({
      userId: user.id,
      roleId: user.roleId,
      deviceId: device.id,
    })
    return { accessToken, refreshToken, user: configuredUser }
  }

  async refreshToken({
    body,
    ip,
    userAgent,
  }: {
    body: RefreshTokenBodyType
    ip: string
    userAgent: string
  }): Promise<RefreshTokenResType> {
    try {
      // Validate refresh token
      const { decodedRefreshToken, dbRefreshToken } = await this.validateRefreshToken(body.refreshToken)
      // Tạo access token và refresh token mới
      const $tokens = this.signTokens({
        userId: dbRefreshToken.userId,
        roleId: dbRefreshToken.user.roleId,
        deviceId: dbRefreshToken.deviceId,
        refreshTokenExp: decodedRefreshToken.exp, // thời gian hết hạn của RT cũ
      })
      // Xóa refresh token cũ
      const $deleteRefreshToken = this.authRepo.deleteRefreshToken(body.refreshToken)
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

  async logout(body: LogoutBodyType): Promise<MessageResType> {
    try {
      // Validate refresh token
      const { dbRefreshToken } = await this.validateRefreshToken(body.refreshToken)
      // Xóa refresh token và cập nhật isActive thiết bị thành `false`
      await Promise.all([
        this.authRepo.deleteRefreshToken(body.refreshToken),
        this.authRepo.updateDevice({
          deviceId: dbRefreshToken.deviceId,
          data: {
            isActive: false,
          },
        }),
      ])
      return {
        message: 'Đăng xuất thành công.',
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message)
      }
      throw error
    }
  }

  async resetPassword({
    body,
    ip,
    userAgent,
  }: {
    body: ResetPasswordBodyType
    ip: string
    userAgent: string
  }): Promise<ResetPasswordResType> {
    // Kiểm tra OTP code
    const verificationCode = await this.validateVerificationCode({
      email: body.email,
      code: body.code,
      type: VerificationCodeType.FORGOT_PASSWORD,
    })
    // Đặt lại mật khẩu và xóa OTP đã sử dụng
    const hashedPassword = await this.hashingService.hash(body.password)
    const [user] = await Promise.all([
      this.sharedUserRepo.updateIncludeRole({
        where: {
          email: verificationCode.email,
        },
        data: {
          password: hashedPassword,
        },
      }),
      this.authRepo.deleteVerificationCode({
        email_type: {
          email: body.email,
          type: VerificationCodeType.FORGOT_PASSWORD,
        },
      }),
    ])
    // Cho đăng nhập lại ngay -> trả về client tokens và user
    const device = await this.authRepo.createDevice({
      ip,
      userAgent,
      userId: user.id,
    })
    const tokens = await this.signTokens({
      userId: user.id,
      roleId: user.roleId,
      deviceId: device.id,
    })
    return {
      ...tokens,
      user,
    }
  }

  async enable2FA(userId: number): Promise<Enable2FAResType> {
    // Kiểm tra user có tồn tại không
    const user = await this.sharedUserRepo.findUnique({
      id: userId,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // Kiểm tra user đã bật 2FA chưa - yêu cầu là chưa bật
    if (user.totpSecret) {
      throw TwoFactorAuthAlreadyEnabledException
    }
    // Generate totp secret và uri
    const result = this.twoFactorAuthService.generateTOTPSecret(user.email)
    // Cập nhật totpSecret cho user trong DB
    await this.sharedUserRepo.update({
      where: {
        id: user.id,
      },
      data: {
        totpSecret: result.secret,
      },
    })
    // Trả về cho client totp secret và uri
    return result
  }

  async disable2FA({ userId, body }: { userId: number; body: Disable2FABodyType }): Promise<MessageResType> {
    // Kiểm tra user có tồn tại không
    const user = await this.sharedUserRepo.findUnique({
      id: userId,
    })
    if (!user) {
      throw EmailNotFoundException
    }
    // Kiểm tra user có bật 2FA chưa - yêu cầu phải bật
    if (!user.totpSecret) {
      throw TwoFactorAuthNotEnabledException
    }
    // Kiểm tra totpCode hoặc code
    if (body.totpCode) {
      const isValid = this.twoFactorAuthService.verifyTOTP({
        email: user.email,
        secret: user.totpSecret,
        token: body.totpCode,
      })
      if (!isValid) {
        throw InvalidTOTPCodeException
      }
    } else if (body.code) {
      await this.validateVerificationCode({
        email: user.email,
        type: VerificationCodeType.DISABLE_2FA,
        code: body.code,
      })
    }
    // Cập nhật totpSecret thành null cho user
    await this.sharedUserRepo.update({
      where: {
        id: user.id,
      },
      data: {
        totpSecret: null,
      },
    })
    return {
      message: 'Success.Disable2FA',
    }
  }
}
