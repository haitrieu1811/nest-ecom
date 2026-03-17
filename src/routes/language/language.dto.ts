import { createZodDto } from 'nestjs-zod'

import {
  CreateLanguageBodySchema,
  CreateLanguageResSchema,
  GetLanguageResSchema,
  GetLanguagesResSchema,
  LanguageIdParamSchema,
  UpdateLanguageBodySchema,
  UpdateLanguageResSchema,
} from 'src/routes/language/language.schema'

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}
export class CreateLanguageResDTO extends createZodDto(CreateLanguageResSchema) {}
export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}
export class UpdateLanguageResDTO extends createZodDto(UpdateLanguageResSchema) {}
export class GetLanguagesResDTO extends createZodDto(GetLanguagesResSchema) {}
export class GetLanguageResDTO extends createZodDto(GetLanguageResSchema) {}
export class LanguageIdParamDTO extends createZodDto(LanguageIdParamSchema) {}
