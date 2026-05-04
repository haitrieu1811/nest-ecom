import z from 'zod'

export const ProductTranslationSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.ProductTranslationNameMustBeAString').max(500, 'Error.ProductTranslationNameIsTooLong'),
    description: z.string('Error.ProductTranslationDescriptionMustBeAString'),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    productId: z.int('Error.ProductIdMustBeAnInteger').positive('Error.ProductIdMustBePositive'),
    languageId: z.string('Error.LanguageIdMustBeAString').max(5, 'Error.LanguageIdIsTooLong'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const CreateProductTranslationBodySchema = ProductTranslationSchema.pick({
  name: true,
  description: true,
  languageId: true,
})
  .extend({
    productId: z.int('Error.ProductIdMustBeAnInteger').positive('Error.ProductIdMustBePositive'),
  })
  .strict()

export const CreateProductTranslationResSchema = ProductTranslationSchema

export const UpdateProductTranslationBodySchema = ProductTranslationSchema.pick({
  name: true,
  description: true,
}).strict()

export const UpdateProductTranslationResSchema = ProductTranslationSchema

export const ProductTranslationIdParamSchema = z
  .object({
    productTranslationId: z.coerce
      .number('Error.ProductTranslationIdMustBeANumber')
      .int('Error.ProductTranslationIdMustBeAnInteger')
      .positive('Error.ProductTranslationIdMustBePositive'),
  })
  .strict()

export const GetProductTranslationResSchema = ProductTranslationSchema

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>
export type CreateProductTranslationBodyType = z.infer<typeof CreateProductTranslationBodySchema>
export type CreateProductTranslationResType = z.infer<typeof CreateProductTranslationResSchema>
export type UpdateProductTranslationBodyType = z.infer<typeof UpdateProductTranslationBodySchema>
export type UpdateProductTranslationResType = z.infer<typeof UpdateProductTranslationResSchema>
export type ProductTranslationIdParamType = z.infer<typeof ProductTranslationIdParamSchema>
export type GetProductTranslationResType = z.infer<typeof GetProductTranslationResSchema>
