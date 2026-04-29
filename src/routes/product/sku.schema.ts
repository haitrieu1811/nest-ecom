import z from 'zod'

export const SKUSchema = z.object({
  id: z.int().positive(),
  value: z.string('Error.SKUValueMustBeAString').max(500, 'Error.SKUValueIsTooLong'),
  price: z.int('Error.SKUPriceMustBeAnInteger').positive('Error.SKUPriceMustBePositive'),
  stock: z.int('Error.SKUStockMustBeAnInteger').positive('Error.SKUStockMustBePositive'),
  images: z.array(z.string('Error.SKUImageMustBeAString')),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  createdById: z.int().positive().nullable(),
  updatedById: z.int().positive().nullable(),
  productId: z.int().positive(),
})

export const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  images: true,
}).strict()

export type SKUType = z.infer<typeof SKUSchema>
export type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>
