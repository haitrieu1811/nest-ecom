import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import path from 'path'

import envConfig from 'src/shared/config'
import { UPLOAD_DIR } from 'src/shared/constants/utils.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(FilesInterceptor('files', 100))
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
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
    return files.map((file) => ({
      url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`,
    }))
  }

  @Get('static/:filename')
  @IsPublic()
  serveStaticFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename))
  }
}
