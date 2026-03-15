import { Body, Controller, Get, Ip, Post, Query, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ZodResponse } from 'nestjs-zod'

import {
  GetGoogleOAuthLinkResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  ResetPasswordBodyDTO,
  ResetPasswordResDTO,
  SendOTPBodyDTO,
  SetUp2FAResDTO,
  TokensResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleService } from 'src/routes/auth/google.service'
import envConfig from 'src/shared/config'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import UserAgent from 'src/shared/decorators/user-agent.decorator'
import { EmptyBodyDTO } from 'src/shared/dtos/request.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('register')
  @IsPublic()
  @ZodResponse({ type: RegisterResDTO })
  registerClient(@Body() body: RegisterBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.registerClient({
      body,
      ip,
      userAgent,
    })
  }

  @Post('otp')
  @IsPublic()
  @ZodResponse({ type: MessageResDTO })
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body)
  }

  @Post('login')
  @IsPublic()
  @ZodResponse({ type: LoginResDTO })
  login(@Body() body: LoginBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.login({
      body,
      ip,
      userAgent,
    })
  }

  @Post('refresh-token')
  @ZodResponse({ type: TokensResDTO })
  refreshToken(@Body() body: RefreshTokenBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.refreshToken({
      body,
      ip,
      userAgent,
    })
  }

  @Post('logout')
  @ZodResponse({ type: MessageResDTO })
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body)
  }

  @Get('google-link')
  @IsPublic()
  @ZodResponse({ type: GetGoogleOAuthLinkResDTO })
  getGoogleLink(@Ip() ip: string, @UserAgent() userAgent: string) {
    return this.googleService.getAuthorizationUrl({
      ip,
      userAgent,
    })
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('state') state: string, @Query('code') code: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({
        code,
        state,
      })
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }

  @Post('reset-password')
  @IsPublic()
  @ZodResponse({ type: ResetPasswordResDTO })
  resetPassword(@Body() body: ResetPasswordBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.resetPassword({
      body,
      ip,
      userAgent,
    })
  }

  @Post('2fa/setup')
  @ZodResponse({ type: SetUp2FAResDTO })
  setUp2FA(@Body() _: EmptyBodyDTO, @ActiveUser('userId') userId: number) {
    return this.authService.setUp2FA(userId)
  }
}
