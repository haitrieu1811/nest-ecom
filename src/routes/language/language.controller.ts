import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  CreateLanguageBodyDTO,
  CreateLanguageResDTO,
  GetLanguageResDTO,
  GetLanguagesResDTO,
  LanguageIdParamDTO,
  UpdateLanguageBodyDTO,
  UpdateLanguageResDTO,
} from 'src/routes/language/language.dto'
import { LanguageService } from 'src/routes/language/language.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ZodResponse({ type: CreateLanguageResDTO })
  create(@Body() body: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.createLanguage({ body, userId })
  }

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetLanguagesResDTO })
  getLanguages() {
    return this.languageService.getLanguages()
  }

  @Get(':languageId')
  @ZodResponse({ type: GetLanguageResDTO })
  getLanguage(@Param() param: LanguageIdParamDTO) {
    return this.languageService.getLanguage(param.languageId)
  }

  @Put(':languageId')
  @ZodResponse({ type: UpdateLanguageResDTO })
  updateLanguage(
    @Param() param: LanguageIdParamDTO,
    @Body() body: UpdateLanguageBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languageService.updateLanguage({ languageId: param.languageId, body, userId })
  }

  @Delete(':languageId')
  @ZodResponse({ type: MessageResDTO })
  deleteLanguage(@Param() param: LanguageIdParamDTO, @ActiveUser('userId') userId: number) {
    return this.languageService.deleteLanguage({ languageId: param.languageId, userId })
  }
}
