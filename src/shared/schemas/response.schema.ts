import z from 'zod'

export const MessageResSchema = z.object({
  message: z.string(),
})

export const PaginationResSchema = z.object({
  page: z.number().positive(),
  limit: z.number(),
  totalPages: z.number(),
  totalRows: z.number(),
})

export type MessageResType = z.infer<typeof MessageResSchema>
export type PaginationResType = z.infer<typeof PaginationResSchema>
