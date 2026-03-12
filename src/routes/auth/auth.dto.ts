import { createZodDto } from 'nestjs-zod'

import {
  Disable2FABodySchema,
  GetGoogleOAuthLinkResSchema,
  GoogleOAuthLinkStateSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RegisterBodySchema,
  RegisterResSchema,
  ResetPasswordBodySchema,
  ResetPasswordResSchema,
  SendOTPBodySchema,
  TokensResSchema,
} from 'src/routes/auth/auth.schema'

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}
export class RegisterResDTO extends createZodDto(RegisterResSchema) {}
export class SendOTPBodyDTO extends createZodDto(SendOTPBodySchema) {}
export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}
export class LoginResDTO extends createZodDto(LoginResSchema) {}
export class TokensResDTO extends createZodDto(TokensResSchema) {}
export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}
export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
export class GoogleOAuthLinkStateDTO extends createZodDto(GoogleOAuthLinkStateSchema) {}
export class GetGoogleOAuthLinkResDTO extends createZodDto(GetGoogleOAuthLinkResSchema) {}
export class ResetPasswordBodyDTO extends createZodDto(ResetPasswordBodySchema) {}
export class ResetPasswordResDTO extends createZodDto(ResetPasswordResSchema) {}
export class Disable2FABodyDTO extends createZodDto(Disable2FABodySchema) {}
