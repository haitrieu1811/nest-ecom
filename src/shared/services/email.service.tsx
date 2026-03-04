import { Injectable } from '@nestjs/common'
import OTPEmail from 'emails/otp'
import { Resend } from 'resend'

import envConfig from 'src/shared/config'

@Injectable()
export class EmailService {
  resend: Resend

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)
  }

  sendOTP({ otp, email, title, description }: { otp: string; email: string; title: string; description: string }) {
    return this.resend.emails.send({
      from: 'Nest Ecom <no-reply@tranhaitrieu.com>',
      to: [email],
      subject: title,
      react: <OTPEmail code={otp} title={title} description={description} />,
    })
  }
}
