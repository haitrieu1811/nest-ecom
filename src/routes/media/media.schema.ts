import z from 'zod'

export const UploadImagesResSchema = z.object({
  data: z.array(
    z.object({
      url: z.url('Error.UrlIsInvalid'),
    }),
  ),
})

export const GetPresignedUrlBodySchema = z
  .object({
    filename: z.string('Error.FileNameMustBeAString'),
  })
  .strict()

export const GetPresignedUrlResSchema = z.object({
  presignedUrl: z.url('Error.PresignedUrlMustBeAnUrl'),
  url: z.url('Error.UrlIsInvalid'),
})

export type UploadImagesResType = z.infer<typeof UploadImagesResSchema>
export type GetPresignedUrlBodyType = z.infer<typeof GetPresignedUrlBodySchema>
export type GetPresignedUrlResType = z.infer<typeof GetPresignedUrlResSchema>
