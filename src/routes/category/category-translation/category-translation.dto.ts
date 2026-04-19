import { createZodDto } from 'nestjs-zod'

import {
  CategoryTranslationIdParamSchema,
  CreateCategoryTranslationBodySchema,
  CreateCategoryTranslationResSchema,
  GetCategoryTranslationResSchema,
  UpdateCategoryTranslationBodySchema,
  UpdateCategoryTranslationResSchema,
} from 'src/routes/category/category-translation/category-translation.schema'

export class CreateCategoryTranslationBodyDTO extends createZodDto(CreateCategoryTranslationBodySchema) {}
export class CreateCategoryTranslationResDTO extends createZodDto(CreateCategoryTranslationResSchema) {}
export class UpdateCategoryTranslationBodyDTO extends createZodDto(UpdateCategoryTranslationBodySchema) {}
export class UpdateCategoryTranslationResDTO extends createZodDto(UpdateCategoryTranslationResSchema) {}
export class CategoryTranslationIdParamDTO extends createZodDto(CategoryTranslationIdParamSchema) {}
export class GetCategoryTranslationResDTO extends createZodDto(GetCategoryTranslationResSchema) {}
