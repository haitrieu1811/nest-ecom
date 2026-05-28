import z from 'zod'

export const CategoryTranslationSchema = z
  .object({
    id: z.int().positive(),
    name: z
      .string('Error.CategoryTranslationNameMustBeAString')
      .min(1, 'Error.CategoryTranslationNameIsRequired')
      .max(100, 'Error.CategoryTranslationNameIsTooLong'),
    description: z
      .string('Error.CategoryTranslationDescriptionMustBeAString')
      .max(500, 'Error.CategoryTranslationDescriptionIsTooLong')
      .optional(),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    categoryId: z.int('Error.CategoryIdMustBeAnInteger').positive('Error.CategoryIdMustBePositive'),
    languageId: z
      .string('Error.LanguageIdMustBeAString')
      .min(1, 'Error.LanguageIdIsRequired')
      .max(5, 'Error.LanguageIdIsTooLong'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>
