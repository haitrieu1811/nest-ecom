import z from 'zod'

export const BrandTranslationSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.BrandTranslationNameMustBeAString').max(100, 'Error.BrandTranslationNameIsTooLong'),
    description: z
      .string('Error.BrandTranslationDescriptionMustBeAString')
      .max(500, 'Error.BrandTranslationDescriptionIsTooLong')
      .optional(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    brandId: z.int('Error.BrandIdMustBeAnInteger').positive('Error.BrandIdMustBePositive'),
    languageId: z.string('Error.LanguageIdMustBeAString').max(5, 'Error.LanguageIdIsTooLong'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>
