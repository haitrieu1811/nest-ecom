import { createZodDto } from 'nestjs-zod'

import {
  GetPresignedUrlBodySchema,
  GetPresignedUrlResSchema,
  UploadImagesResSchema,
} from 'src/routes/media/media.schema'

export class UploadImagesResDTO extends createZodDto(UploadImagesResSchema) {}
export class GetPresignedUrlBodyDTO extends createZodDto(GetPresignedUrlBodySchema) {}
export class GetPresignedUrlResDTO extends createZodDto(GetPresignedUrlResSchema) {}
