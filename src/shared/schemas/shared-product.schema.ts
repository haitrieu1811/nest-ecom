import z from 'zod'

export const VariantSchema = z.object({
  value: z.string('Error.ProductVariantValueMustBeAString').trim(),
  options: z.array(z.string('Error.ProductVariantOptionMustBeAString').trim()),
})

export const VariantsSchema = z
  .array(VariantSchema, 'Error.ProductVariantsMustBeAnArrayOfVariants')
  .superRefine((variants, ctx) => {
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const isExistingVariant =
        variants.findIndex((v) => v.value.toLowerCase().trim() === variant.value.toLowerCase().trim()) !== i
      if (isExistingVariant) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantValueMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
      const isDifferentOption = variant.options.some((option, index) => {
        const isExistingOption =
          variant.options.findIndex((o) => o.toLowerCase().trim() === option.toLowerCase().trim()) !== index
        return isExistingOption
      })
      if (isDifferentOption) {
        return ctx.addIssue({
          code: 'custom',
          message: `Error.ProductVariantOptionsMustBeUnique: ${variant.value}`,
          path: ['variants'],
        })
      }
    }
  })

export const SKUSchema = z.object({
  id: z.int().positive(),
  value: z.string('Error.SKUValueMustBeAString').max(500, 'Error.SKUValueIsTooLong').trim(),
  price: z.int('Error.SKUPriceMustBeAnInteger').nonnegative('Error.SKUPriceMustBeNonNegative'),
  stock: z.int('Error.SKUStockMustBeAnInteger').nonnegative('Error.SKUStockMustBeNonNegative'),
  images: z.array(z.string('Error.SKUImageMustBeAString')),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdById: z.int().positive().nullable(),
  updatedById: z.int().positive().nullable(),
  productId: z.int().positive(),
})

export type VariantType = z.infer<typeof VariantSchema>
export type VariantsType = z.infer<typeof VariantsSchema>
export type SKUType = z.infer<typeof SKUSchema>
