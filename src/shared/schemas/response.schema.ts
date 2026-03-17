import z from 'zod'

export const MessageResSchema = z.object({
  message: z.string(),
})

export const PaginationResType = z.object({
  page: z.number().positive(),
  limit: z.number().positive(),
  totalPages: z.number().positive(),
  totalRows: z.number().positive(),
})

export type MessageResType = z.infer<typeof MessageResSchema>
export type PaginationResType = z.infer<typeof PaginationResType>
