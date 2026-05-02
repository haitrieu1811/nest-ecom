import z from 'zod'

import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.schema'
import { UpsertSKUBodySchema } from 'src/routes/product/sku.schema'
import { PaginationQuerySchema } from 'src/shared/schemas/request.shema'
import { PaginationResSchema } from 'src/shared/schemas/response.schema'
import { BrandIncludeTranslationsSchema } from 'src/shared/schemas/shared-brand.schema'
import { CategoryIncludeTranslationsSchema } from 'src/shared/schemas/shared-category.schema'
import { SKUSchema, VariantsSchema } from 'src/shared/schemas/shared-product.schema'

export const ProductSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.ProductNameMustBeAString').max(500, 'Error.ProductNameIsTooLong'),
    description: z.string('Error.ProductDescriptionMustBeAString'),
    basePrice: z
      .number('Error.ProductBasePriceMustBeANumber')
      .int('Error.ProductBasePriceMustBeAnInteger')
      .nonnegative('Error.ProductBasePriceMustBeNonNegative'),
    virtualPrice: z
      .number('Error.ProductVirtualPriceMustBeANumber')
      .int('Error.ProductVirtualPriceMustBeAnInteger')
      .nonnegative('Error.ProductVirtualPriceMustBeNonNegative'),
    thumbnail: z.string('Error.ProductThumbnailMustBeAStringOrNull').nullable(),
    images: z.array(z.string('Error.ProductImageMustBeAString')),
    variants: VariantsSchema,
    deletedAt: z.iso.datetime().nullable(),
    publishedAt: z.iso.datetime('Error.ProductPublishedAtMustBeAValidDate').nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    brandId: z.int('Error.BrandIdMustBeANumber').positive('Error.BrandIdMustBePositive').nullable(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export const ProductIncludeTranslationsSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
})

export const ProductDetailSchema = ProductIncludeTranslationsSchema.extend({
  categories: z.array(CategoryIncludeTranslationsSchema),
  brand: BrandIncludeTranslationsSchema.nullable(),
  skus: z.array(SKUSchema),
})

export const CreateProductBodySchema = ProductSchema.pick({
  name: true,
  description: true,
  basePrice: true,
  virtualPrice: true,
  thumbnail: true,
  images: true,
  variants: true,
  publishedAt: true,
  brandId: true,
})
  .extend({
    categories: z.array(z.number().int().positive(), 'Error.ProductCategoriesMustBeAnArrayOfCategoryIds').default([]),
    skus: z.array(UpsertSKUBodySchema, 'Error.ProductSKUsMustBeAnArrayOfSKUs').default([]),
  })
  .strict()

export const CreateProductResSchema = ProductDetailSchema

export const UpdateProductBodySchema = CreateProductBodySchema.strict()

export const UpdateProductResSchema = ProductSchema

export const ProductIdParamSchema = z
  .object({
    productId: z.coerce
      .number('Error.ProductIdMustBeANumber')
      .int('Error.ProductIdMustBeAnInteger')
      .positive('Error.ProductIdMustBePositive'),
  })
  .strict()

export const GetProductsQuerySchema = PaginationQuerySchema.extend({
  brandId: z.coerce
    .number('Error.BrandIdMustBeAnInteger')
    .int('Error.BrandIdMustBeAnInteger')
    .positive('Error.BrandIdMustBePositive')
    .optional(),
})

export const GetProductsResSchema = z.object({
  data: z.array(ProductIncludeTranslationsSchema),
  pagination: PaginationResSchema,
})

export const GetProductResSchema = ProductIncludeTranslationsSchema

export type ProductType = z.infer<typeof ProductSchema>
export type ProductIncludeTranslationsType = z.infer<typeof ProductIncludeTranslationsSchema>
export type ProductDetailType = z.infer<typeof ProductDetailSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type CreateProductResType = z.infer<typeof CreateProductResSchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
export type UpdateProductResType = z.infer<typeof UpdateProductResSchema>
export type ProductIdParamType = z.infer<typeof ProductIdParamSchema>
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductResType = z.infer<typeof GetProductResSchema>
