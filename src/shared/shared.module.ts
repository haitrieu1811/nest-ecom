import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

const SHARED_PROVIDERS = [PrismaService, HashingService, SharedRoleRepo, SharedUserRepo, EmailService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: SHARED_PROVIDERS,
  exports: SHARED_PROVIDERS,
})
export class SharedModule {}
