import { createZodDto } from 'nestjs-zod'

import {
  CreateProductBodySchema,
  CreateProductResSchema,
  GetProductResSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  ProductIdParamSchema,
  UpdateProductBodySchema,
  UpdateProductResSchema,
} from 'src/routes/product/product.schema'

export class CreateProductBodyDTO extends createZodDto(CreateProductBodySchema) {}
export class CreateProductResDTO extends createZodDto(CreateProductResSchema) {}
export class UpdateProductBodyDTO extends createZodDto(UpdateProductBodySchema) {}
export class UpdateProductResDTO extends createZodDto(UpdateProductResSchema) {}
export class ProductIdParamDTO extends createZodDto(ProductIdParamSchema) {}
export class GetProductsQueryDTO extends createZodDto(GetProductsQuerySchema) {}
export class GetProductsResDTO extends createZodDto(GetProductsResSchema) {}
export class GetProductResDTO extends createZodDto(GetProductResSchema) {}
