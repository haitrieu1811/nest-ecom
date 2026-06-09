import z from 'zod'

import { BrandTranslationSchema } from 'src/shared/schemas/shared-brand-translation.schema'

export const CreateBrandTranslationBodySchema = BrandTranslationSchema.pick({
  name: true,
  description: true,
  languageId: true,
})
  .extend({
    brandId: z.int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
  })
  .strict()

export const CreateBrandTranslationResSchema = BrandTranslationSchema

export const UpdateBrandTranslationBodySchema = CreateBrandTranslationBodySchema

export const UpdateBrandTranslationResSchema = BrandTranslationSchema

export const BrandTranslationIdParamSchema = z
  .object({
    brandTranslationId: z.coerce
      .number()
      .int('Error.BrandTranslationIdMustBeAnInteger')
      .positive('Error.BrandTranslationIdMustBePositive'),
  })
  .strict()

export const GetBrandTranslationResSchema = BrandTranslationSchema

export type CreateBrandTranslationBodyType = z.infer<typeof CreateBrandTranslationBodySchema>
export type CreateBrandTranslationResType = z.infer<typeof CreateBrandTranslationResSchema>
export type UpdateBrandTranslationBodyType = z.infer<typeof UpdateBrandTranslationBodySchema>
export type UpdateBrandTranslationResType = z.infer<typeof UpdateBrandTranslationResSchema>
export type BrandTranslationIdParamType = z.infer<typeof BrandTranslationIdParamSchema>
export type GetBrandTranslationResType = z.infer<typeof GetBrandTranslationResSchema>
