import { Module } from '@nestjs/common'

import { BrandTranslationController } from 'src/routes/brand/brand-translation/brand-translation.controller'
import { BrandTranslationRepo } from 'src/routes/brand/brand-translation/brand-translation.repo'
import { BrandTranslationService } from 'src/routes/brand/brand-translation/brand-translation.service'
import { BrandRepo } from 'src/routes/brand/brand.repo'

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepo, BrandRepo],
})
export class BrandTranslationModule {}
