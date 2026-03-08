import { Body, Controller, Ip, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
  TokensResDTO,
} from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import UserAgent from 'src/shared/decorators/user-agent.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: RegisterResDTO })
  registerClient(@Body() body: RegisterBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.registerClient({
      body,
      ip,
      userAgent,
    })
  }

  @Post('otp')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body)
  }

  @Post('login')
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
}
