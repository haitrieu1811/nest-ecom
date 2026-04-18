import { createZodDto } from 'nestjs-zod'

import {
  BrandIdParamSchema,
  CreateBrandBodySchema,
  CreateBrandResSchema,
  GetBrandResSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema,
  UpdateBrandResSchema,
} from 'src/routes/brand/brand.schema'

export class CreateBrandBodyDTO extends createZodDto(CreateBrandBodySchema) {}
export class CreateBrandResDTO extends createZodDto(CreateBrandResSchema) {}
export class UpdateBrandBodyDTO extends createZodDto(UpdateBrandBodySchema) {}
export class UpdateBrandResDTO extends createZodDto(UpdateBrandResSchema) {}
export class BrandIdParamDTO extends createZodDto(BrandIdParamSchema) {}
export class GetBrandsResDTO extends createZodDto(GetBrandsResSchema) {}
export class GetBrandResDTO extends createZodDto(GetBrandResSchema) {}
