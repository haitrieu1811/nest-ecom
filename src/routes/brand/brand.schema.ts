import z from 'zod'

import { BrandTranslationSchema } from 'src/shared/schemas/shared-brand-translation.schema'
import { BrandSchema } from 'src/shared/schemas/shared-brand.schema'

export const BrandIncludeTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export const CreateBrandBodySchema = BrandSchema.pick({
  logo: true,
  name: true,
  description: true,
}).strict()

export const CreateBrandResSchema = BrandSchema

export const UpdateBrandBodySchema = CreateBrandBodySchema.strict()

export const UpdateBrandResSchema = BrandSchema

export const BrandIdParamSchema = z
  .object({
    brandId: z.coerce.number().int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
  })
  .strict()

export const GetBrandsResSchema = z.object({
  data: z.array(BrandIncludeTranslationsSchema),
  totalItems: z.number().int().positive(),
})

export const GetBrandResSchema = BrandIncludeTranslationsSchema

export type BrandIncludeTranslationsType = z.infer<typeof BrandIncludeTranslationsSchema>
export type CreateBrandBodyType = z.infer<typeof CreateBrandBodySchema>
export type CreateBrandResType = z.infer<typeof CreateBrandResSchema>
export type UpdateBrandBodyType = z.infer<typeof UpdateBrandBodySchema>
export type UpdateBrandResType = z.infer<typeof UpdateBrandResSchema>
export type BrandIdParamType = z.infer<typeof BrandIdParamSchema>
export type GetBrandsResType = z.infer<typeof GetBrandsResSchema>
export type GetBrandResType = z.infer<typeof GetBrandResSchema>
