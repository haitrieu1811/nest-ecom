import { createZodDto } from 'nestjs-zod'

import {
  CategoryIdParamSchema,
  CreateCategoryBodySchema,
  CreateCategoryResSchema,
  GetCategoriesQuerySchema,
  GetCategoriesResSchema,
  GetCategoryResSchema,
  UpdateCategoryBodySchema,
  UpdateCategoryResSchema,
} from 'src/routes/category/category.schema'

export class CreateCategoryBodyDTO extends createZodDto(CreateCategoryBodySchema) {}
export class CreateCategoryResDTO extends createZodDto(CreateCategoryResSchema) {}
export class UpdateCategoryBodyDTO extends createZodDto(UpdateCategoryBodySchema) {}
export class UpdateCategoryResDTO extends createZodDto(UpdateCategoryResSchema) {}
export class CategoryIdParamDTO extends createZodDto(CategoryIdParamSchema) {}
export class GetCategoriesQueryDTO extends createZodDto(GetCategoriesQuerySchema) {}
export class GetCategoriesResDTO extends createZodDto(GetCategoriesResSchema) {}
export class GetCategoryResDTO extends createZodDto(GetCategoryResSchema) {}
