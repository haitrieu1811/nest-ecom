import { Injectable } from '@nestjs/common'
import { unlink } from 'fs/promises'
import { GetPresignedUrlBodyType, GetPresignedUrlResType, UploadImagesResType } from 'src/routes/media/media.schema'

import { generateFilename } from 'src/shared/helpers'
import { S3Service } from 'src/shared/services/s3.service'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadImages(files: Array<Express.Multer.File>): Promise<UploadImagesResType> {
    const result = await Promise.all(
      files.map(async (file) => {
        const s3Response = await this.s3Service.upload({
          filename: `images/${file.filename}`,
          filepath: file.path,
          contentType: file.mimetype,
        })
        return {
          url: s3Response.Location ?? '',
        }
      }),
    )
    // Xóa ảnh ở local khi upload lên S3 thành công
    await Promise.all(files.map((file) => unlink(file.path)))
    return {
      data: result,
    }
  }

  async getPresignedUrl(body: GetPresignedUrlBodyType): Promise<GetPresignedUrlResType> {
    const filename = generateFilename(body.filename)
    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(`images/${filename}`)
    const url = presignedUrl.split('?')[0]
    return {
      presignedUrl,
      url,
    }
  }
}
