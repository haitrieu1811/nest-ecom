import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import { unlink } from 'fs/promises'
import path from 'path'
import { ParseFileWithUnlinkPipe } from 'src/routes/media/parse-file-with-unlink.pipe'

import { UPLOAD_DIR } from 'src/shared/constants/utils.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { S3Service } from 'src/shared/services/s3.service'

@Controller('media')
export class MediaController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('images/upload')
  @UseInterceptors(FilesInterceptor('files', 100))
  async uploadFile(
    @UploadedFiles(
      new ParseFileWithUnlinkPipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024, errorMessage: 'Error.FileIsTooLarge' }), // 1MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
            skipMagicNumbersValidation: true,
            errorMessage: 'Error.FileIsInvalid',
          }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const result = await Promise.all(
      files.map(async (file) => {
        const s3Response = await this.s3Service.upload({
          filename: `images/${file.filename}`,
          filepath: file.path,
          contentType: file.mimetype,
        })
        return {
          url: s3Response.Location,
        }
      }),
    )
    // Xóa ảnh ở local khi upload lên S3 thành công
    await Promise.all(files.map((file) => unlink(file.path)))
    return result
  }

  @Get('static/:filename')
  @IsPublic()
  serveStaticFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename))
  }
}
