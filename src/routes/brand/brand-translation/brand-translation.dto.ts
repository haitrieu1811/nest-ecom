import { createZodDto } from 'nestjs-zod'

import {
  BrandTranslationIdParamSchema,
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationResSchema,
  GetBrandTranslationResSchema,
  UpdateBrandTranslationBodySchema,
  UpdateBrandTranslationResSchema,
} from 'src/routes/brand/brand-translation/brand-translation.schema'

export class CreateBrandTranslationBodyDTO extends createZodDto(CreateBrandTranslationBodySchema) {}
export class CreateBrandTranslationResDTO extends createZodDto(CreateBrandTranslationResSchema) {}
export class UpdateBrandTranslationBodyDTO extends createZodDto(UpdateBrandTranslationBodySchema) {}
export class UpdateBrandTranslationResDTO extends createZodDto(UpdateBrandTranslationResSchema) {}
export class BrandTranslationIdParamDTO extends createZodDto(BrandTranslationIdParamSchema) {}
export class GetBrandTranslationResDTO extends createZodDto(GetBrandTranslationResSchema) {}
