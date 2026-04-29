import z from 'zod'

import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.schema'
import { SKUSchema } from 'src/routes/product/sku.schema'
import { PaginationQuerySchema } from 'src/shared/schemas/request.shema'
import { PaginationResSchema } from 'src/shared/schemas/response.schema'
import { BrandIncludeTranslationsSchema } from 'src/shared/schemas/shared-brand.schema'
import { CategoryIncludeTranslationsSchema } from 'src/shared/schemas/shared-category.schema'

const VariantSchema = z.object({
  value: z.string('Error.ProductVariantValueMustBeAString'),
  options: z.array(z.string('Error.ProductVariantOptionMustBeAString')),
})

const VariantsSchema = z
  .array(VariantSchema, 'Error.ProductVariantsMustBeAnArrayOfVariants')
  .superRefine((variants, ctx) => {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const isDifferent = variants.findIndex((v) => v.value === variant.value) !== i
      if (!isDifferent) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantValueMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
      const isDifferentOption = variant.options.findIndex((o) => variant.options.includes(o)) !== -1
      if (isDifferentOption) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantOptionsMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
    }
  })

export const ProductSchema = z
  .object({
    id: z.int().positive(),
    name: z.string('Error.ProductNameMustBeAString').max(500, 'Error.ProductNameIsTooLong'),
    description: z.string('Error.ProductDescriptionMustBeAString'),
    basePrice: z
      .number('Error.ProductBasePriceMustBeANumber')
      .int('Error.ProductBasePriceMustBeAnInteger')
      .positive('Error.ProductBasePriceMustBePositive'),
    virtualPrice: z
      .number('Error.ProductVirtualPriceMustBeANumber')
      .int('Error.ProductVirtualPriceMustBeAnInteger')
      .positive('Error.ProductVirtualPriceMustBePositive'),
    thumbnail: z.string('Error.ProductThumbnailMustBeAString').nullable(),
    images: z.array(z.string('Error.ProductImageMustBeAString')).nullable(),
    variants: VariantsSchema,
    deletedAt: z.iso.datetime().nullable(),
    publishedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    brandId: z.int().positive().nullable(),
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
}).strict()

export const CreateProductResSchema = ProductSchema

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

export type VariantType = z.infer<typeof VariantSchema>
export type VariantsType = z.infer<typeof VariantsSchema>
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
