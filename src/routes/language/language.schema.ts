import z from 'zod'

export const LanguageSchema = z
  .object({
    id: z.string('Error.LanguageIdIsRequired').max(5, 'Error.InvalidLengthLanguageId'),
    name: z.string('Error.LanguageNameIsRequired').max(100, 'Error.InvalidLengthLanguageName'),
    deletedAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    createdById: z.int().positive(),
    updatedById: z.int().positive(),
    deletedById: z.int().positive().nullable(),
  })
  .strict()

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict()

export const CreateLanguageResSchema = LanguageSchema

export const UpdateLanguageBodySchema = LanguageSchema.pick({
  name: true,
}).strict()

export const UpdateLanguageResSchema = LanguageSchema

export const GetLanguagesResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number().positive(),
})

export const GetLanguageResSchema = LanguageSchema

export const LanguageIdParamSchema = z
  .object({
    languageId: z.string(),
  })
  .strict()

export type LanguageType = z.infer<typeof LanguageSchema>
export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>
export type CreateLanguageResType = z.infer<typeof CreateLanguageResSchema>
export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>
export type UpdateLanguageResType = z.infer<typeof UpdateLanguageResSchema>
export type GetLanguagesResType = z.infer<typeof GetLanguagesResSchema>
export type GetLanguageResType = z.infer<typeof GetLanguageResSchema>
export type LanguageIdParamType = z.infer<typeof LanguageIdParamSchema>
