import { Module } from '@nestjs/common'

import { AuthController } from 'src/routes/auth/auth.controller'
import { AuthService } from 'src/routes/auth/auth.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
