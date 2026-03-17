import { Module } from '@nestjs/common'

import { LanguageController } from 'src/routes/language/language.controller'
import { LanguageRepo } from 'src/routes/language/language.repo'
import { LanguageService } from 'src/routes/language/language.service'

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepo],
})
export class LanguageModule {}
