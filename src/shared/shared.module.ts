import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { SharedBrandRepo } from 'src/shared/repositories/shared-brand.repo'
import { SharedCategoryRepo } from 'src/shared/repositories/shared-category.repo'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { TwoFactorAuthService } from 'src/shared/services/2fa.service'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { S3Service } from 'src/shared/services/s3.service'
import { TokenService } from 'src/shared/services/token.service'

const SHARED_PROVIDERS = [
  PrismaService,
  HashingService,
  SharedRoleRepo,
  SharedUserRepo,
  SharedBrandRepo,
  SharedCategoryRepo,
  EmailService,
  TokenService,
  AccessTokenGuard,
  ApiKeyGuard,
  TwoFactorAuthService,
  S3Service,
]

@Global()
@Module({
  imports: [JwtModule],
  providers: [...SHARED_PROVIDERS],
  exports: SHARED_PROVIDERS,
})
export class SharedModule {}
