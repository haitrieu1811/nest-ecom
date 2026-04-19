import { CategoryTranslationSchema } from 'src/routes/category/category-translation/category-translation.schema'
import { PaginationQuerySchema } from 'src/shared/schemas/request.shema'
import z from 'zod'

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

export const CreateCategoryBodySchema = CategorySchema.pick({
  name: true,
  description: true,
  logo: true,
  parentId: true,
}).strict()

export const CreateCategoryResSchema = CategorySchema

export const UpdateCategoryBodySchema = CategorySchema.pick({
  logo: true,
  name: true,
  description: true,
  parentId: true,
}).strict()

export const UpdateCategoryResSchema = CategorySchema

export const CategoryIdParamSchema = z
  .object({
    categoryId: z.coerce.number().int('Error.CategoryIdMustBeAnInteger').positive('Error.CategoryIdMustBePositive'),
  })
  .strict()

export const GetCategoriesQuerySchema = PaginationQuerySchema.extend({
  parentId: z.coerce
    .number('Error.CategoryParentIdMustBeAnInteger')
    .int('Error.CategoryParentIdMustBeAnInteger')
    .positive('Error.CategoryParentIdMustBeAPositiveInteger')
    .optional(),
})

export const GetCategoriesResSchema = z.object({
  data: z.array(CategoryIncludeTranslationsSchema),
  totalItems: z.number(),
})

export const GetCategoryResSchema = CategoryIncludeTranslationsSchema

export type CategoryType = z.infer<typeof CategorySchema>
export type CategoryIncludeTranslationsType = z.infer<typeof CategoryIncludeTranslationsSchema>
export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>
export type CreateCategoryResType = z.infer<typeof CreateCategoryResSchema>
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>
export type UpdateCategoryResType = z.infer<typeof UpdateCategoryResSchema>
export type CategoryIdParamType = z.infer<typeof CategoryIdParamSchema>
export type GetCategoriesQueryType = z.infer<typeof GetCategoriesQuerySchema>
export type GetCategoriesResType = z.infer<typeof GetCategoriesResSchema>
export type GetCategoryResType = z.infer<typeof GetCategoryResSchema>
