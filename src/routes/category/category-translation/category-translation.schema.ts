import z from 'zod'

import { CategoryTranslationSchema } from 'src/shared/schemas/shared-category-translation.schema'

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

export type CreateCategoryTranslationBodyType = z.infer<typeof CreateCategoryTranslationBodySchema>
export type CreateCategoryTranslationResType = z.infer<typeof CreateCategoryTranslationResSchema>
export type UpdateCategoryTranslationBodyType = z.infer<typeof UpdateCategoryTranslationBodySchema>
export type UpdateCategoryTranslationResType = z.infer<typeof UpdateCategoryTranslationResSchema>
export type CategoryTranslationIdParamType = z.infer<typeof CategoryTranslationIdParamSchema>
export type GetCategoryTranslationResType = z.infer<typeof GetCategoryTranslationResSchema>
