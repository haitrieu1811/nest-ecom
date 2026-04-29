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

export type ProductTranslationType = z.infer<typeof ProductTranslationSchema>
