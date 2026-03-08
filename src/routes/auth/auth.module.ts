import { Module } from '@nestjs/common'

import { AuthController } from 'src/routes/auth/auth.controller'
import { AuthRepo } from 'src/routes/auth/auth.repo'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleService } from 'src/routes/auth/google.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepo, GoogleService],
})
export class AuthModule {}
