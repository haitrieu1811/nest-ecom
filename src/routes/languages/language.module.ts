import { Module } from '@nestjs/common'

import { LanguageController } from 'src/routes/languages/language.controller'
import { LanguageRepo } from 'src/routes/languages/language.repo'
import { LanguageService } from 'src/routes/languages/language.service'

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepo],
})
export class LanguageModule {}
