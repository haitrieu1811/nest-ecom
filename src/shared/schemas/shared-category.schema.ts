import z from 'zod'

import { CategoryTranslationSchema } from 'src/shared/schemas/shared-category-translation.schema'

export const CategorySchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.CategoryNameMustBeAString').max(100, 'Error.CategoryNameMustBeAtMost100Characters'),
    description: z
      .string('Error.CategoryDescriptionMustBeAString')
      .max(500, 'Error.CategoryDescriptionMustBeAtMost500Characters')
      .default(''),
    logo: z.string('Error.CategoryLogoMustBeAStringOrNull').nullable(),
    parentId: z
      .int('Error.CategoryParentIdMustBeAnIntegerOrNull')
      .positive('Error.CategoryParentIdMustBeAPositiveInteger')
      .nullable(), // Nếu parentId là null thì đây là category cấp 1, ngược lại là category cấp 2
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const CategoryIncludeTranslationsSchema = CategorySchema.extend({
  categoryTranslations: z.array(CategoryTranslationSchema),
})

export type CategoryType = z.infer<typeof CategorySchema>
export type CategoryIncludeTranslationsType = z.infer<typeof CategoryIncludeTranslationsSchema>
