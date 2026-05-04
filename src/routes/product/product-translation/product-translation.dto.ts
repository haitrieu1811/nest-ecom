import { createZodDto } from 'nestjs-zod'

import {
  CreateProductTranslationBodySchema,
  CreateProductTranslationResSchema,
  GetProductTranslationResSchema,
  ProductTranslationIdParamSchema,
  UpdateProductTranslationBodySchema,
  UpdateProductTranslationResSchema,
} from 'src/routes/product/product-translation/product-translation.schema'

export class CreateProductTranslationBodyDTO extends createZodDto(CreateProductTranslationBodySchema) {}
export class CreateProductTranslationResDTO extends createZodDto(CreateProductTranslationResSchema) {}
export class UpdateProductTranslationBodyDTO extends createZodDto(UpdateProductTranslationBodySchema) {}
export class UpdateProductTranslationResDTO extends createZodDto(UpdateProductTranslationResSchema) {}
export class ProductTranslationIdParamDTO extends createZodDto(ProductTranslationIdParamSchema) {}
export class GetProductTranslationResDTO extends createZodDto(GetProductTranslationResSchema) {}
