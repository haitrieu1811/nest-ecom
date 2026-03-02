import { Global, Module } from '@nestjs/common'

import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const SHARED_PROVIDERS = [PrismaService, HashingService, SharedRoleRepo]

@Global()
@Module({
  providers: SHARED_PROVIDERS,
  exports: SHARED_PROVIDERS,
})
export class SharedModule {}
