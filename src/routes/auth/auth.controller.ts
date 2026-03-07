import { Body, Controller, Ip, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { LoginBodyDTO, LoginResDTO, RegisterBodyDTO, RegisterResDTO, SendOTPBodyDTO } from 'src/routes/auth/auth.dto'
import { AuthService } from 'src/routes/auth/auth.service'
import UserAgent from 'src/shared/decorators/user-agent.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: RegisterResDTO })
  registerClient(@Body() body: RegisterBodyDTO, @Ip() ip: string, @UserAgent() userAgent: string) {
    return this.authService.registerClient({
      data: body,
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
      data: body,
      ip,
      userAgent,
    })
  }
}
