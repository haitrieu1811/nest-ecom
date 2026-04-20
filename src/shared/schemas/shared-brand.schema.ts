import z from 'zod'

export const BrandSchema = z
  .object({
    id: z.int().positive(),
    logo: z.string().nullable(),
    name: z.string().max(100, 'Error.BrandNameIsTooLong'),
    description: z.string().max(500, 'Error.BrandDescriptionIsTooLong').default(''),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.int().positive().nullable(),
    updatedById: z.int().positive().nullable(),
  })
  .strict()

export type BrandType = z.infer<typeof BrandSchema>
