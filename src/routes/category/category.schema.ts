import z from 'zod'

import { PaginationQuerySchema } from 'src/shared/schemas/request.shema'
import { CategoryIncludeTranslationsSchema, CategorySchema } from 'src/shared/schemas/shared-category.schema'

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

export type CreateCategoryBodyType = z.infer<typeof CreateCategoryBodySchema>
export type CreateCategoryResType = z.infer<typeof CreateCategoryResSchema>
export type UpdateCategoryBodyType = z.infer<typeof UpdateCategoryBodySchema>
export type UpdateCategoryResType = z.infer<typeof UpdateCategoryResSchema>
export type CategoryIdParamType = z.infer<typeof CategoryIdParamSchema>
export type GetCategoriesQueryType = z.infer<typeof GetCategoriesQuerySchema>
export type GetCategoriesResType = z.infer<typeof GetCategoriesResSchema>
export type GetCategoryResType = z.infer<typeof GetCategoryResSchema>
