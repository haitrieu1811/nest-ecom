import z from 'zod'

export const CategoryTranslationSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.CategoryTranslationNameMustBeAString').max(100, 'Error.CategoryTranslationNameIsTooLong'),
    description: z
      .string('Error.CategoryTranslationDescriptionMustBeAString')
      .max(500, 'Error.CategoryTranslationDescriptionIsTooLong')
      .default(''),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    categoryId: z.int('Error.CategoryIdMustBeAnInteger').positive('Error.CategoryIdMustBePositive'),
    languageId: z.string('Error.LanguageIdMustBeAString').max(5, 'Error.LanguageIdIsTooLong'),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const CreateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
  name: true,
  description: true,
  languageId: true,
})
  .extend({
    categoryId: z.int('Error.CategoryIdMustBeAnInteger').positive('Error.CategoryIdMustBePositive'),
  })
  .strict()

export const CreateCategoryTranslationResSchema = CategoryTranslationSchema

export const UpdateCategoryTranslationBodySchema = CategoryTranslationSchema.pick({
  name: true,
  description: true,
}).strict()

export const UpdateCategoryTranslationResSchema = CategoryTranslationSchema

export const CategoryTranslationIdParamSchema = z
  .object({
    categoryTranslationId: z.coerce
      .number('Error.CategoryTranslationIdMustBeANumber')
      .int('Error.CategoryTranslationIdMustBeAnInteger')
      .positive('Error.CategoryTranslationIdMustBePositive'),
  })
  .strict()

export const GetCategoryTranslationResSchema = CategoryTranslationSchema

export type CategoryTranslationType = z.infer<typeof CategoryTranslationSchema>
export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>
export type CreateCategoryTranslationResType = z.infer<typeof CreateCategoryTranslationResSchema>
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>
export type UpdateCategoryTranslationResType = z.infer<typeof UpdateCategoryTranslationResSchema>
export type CategoryTranslationIdParamType = z.infer<typeof CategoryTranslationIdParamSchema>
export type GetCategoryTranslationResType = z.infer<typeof GetCategoryTranslationResSchema>
