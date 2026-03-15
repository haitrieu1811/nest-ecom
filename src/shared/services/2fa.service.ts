import { Injectable } from '@nestjs/common'
import * as OTPAuth from 'otpauth'

import { SetUp2FAResType } from 'src/routes/auth/auth.schema'
import envConfig from 'src/shared/config'

@Injectable()
export class TwoFactorAuthService {
  private createTOTP({ email, secret }: { email: string; secret?: string }) {
    return new OTPAuth.TOTP({
      issuer: envConfig.APP_NAME,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret ?? new OTPAuth.Secret(),
    })
  }

  generateTOTPSecret(email: string): SetUp2FAResType {
    const totp = this.createTOTP({ email })
    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    }
  }

  verifyTOTP({ email, token, secret }: { email: string; token: string; secret: string }) {
    const totp = this.createTOTP({ email, secret })
    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  }
}
