import z from 'zod'

import { SKUSchema } from 'src/shared/schemas/shared-product.schema'

export const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  images: true,
}).strict()

export type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>
