import z from 'zod'

export const EmptyBodySchema = z.object({}).strict()

export const PaginationQuerySchema = z.object({
  page: z.coerce.number('Error.PageIsInvalid').int('Error.PageIsInvalid').positive('Error.PageIsInvalid').default(1),
  limit: z.coerce
    .number('Error.LimitIsInvalid')
    .int('Error.LimitIsInvalid')
    .positive('Error.LimitIsInvalid')
    .default(20),
})

export type EmptyBodyType = z.infer<typeof EmptyBodySchema>
export type PaginationQueryType = z.infer<typeof PaginationQuerySchema>
