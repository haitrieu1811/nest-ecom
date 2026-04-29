import z from 'zod'

import { BrandTranslationSchema } from 'src/shared/schemas/shared-brand-translation.schema'

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

export const BrandIncludeTranslationsSchema = BrandSchema.extend({
  brandTranslations: z.array(BrandTranslationSchema),
})

export type BrandType = z.infer<typeof BrandSchema>
export type BrandIncludeTranslationsType = z.infer<typeof BrandIncludeTranslationsSchema>
