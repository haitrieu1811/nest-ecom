import {
  Body,
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
import { ZodResponse } from 'nestjs-zod'
import path from 'path'

import { GetPresignedUrlBodyDTO, GetPresignedUrlResDTO, UploadImagesResDTO } from 'src/routes/media/media.dto'
import { MediaService } from 'src/routes/media/media.service'
import { ParseFileWithUnlinkPipe } from 'src/routes/media/parse-file-with-unlink.pipe'
import { UPLOAD_DIR } from 'src/shared/constants/utils.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @UseInterceptors(FilesInterceptor('files', 100))
  @ZodResponse({ type: UploadImagesResDTO })
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
    return this.mediaService.uploadImages(files)
  }

  @Get('static/:filename')
  @IsPublic()
  serveStaticFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename))
  }

  @Post('images/upload/presigned-url')
  @ZodResponse({ type: GetPresignedUrlResDTO })
  getPresignedUrl(@Body() body: GetPresignedUrlBodyDTO) {
    return this.mediaService.getPresignedUrl(body)
  }
}
