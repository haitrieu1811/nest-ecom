import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

import envConfig from 'src/shared/config'

@Injectable()
export class EmailService {
  resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendOTP({ otp, email }: { otp: string; email: string }) {
    return this.resend.emails.send({
      from: 'Nest Ecom <no-reply@tranhaitrieu.com>',
      to: [email],
      subject: 'Mã OTP',
      html: `<strong>${otp}</strong>`,
    })
  }
}
