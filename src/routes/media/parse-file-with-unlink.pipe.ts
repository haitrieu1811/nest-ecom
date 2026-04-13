import { ParseFileOptions, ParseFilePipe } from '@nestjs/common'
import { unlink } from 'fs/promises'

export class ParseFileWithUnlinkPipe extends ParseFilePipe {
  constructor(options?: ParseFileOptions) {
    super(options)
  }

  async transform(files: Array<Express.Multer.File>): Promise<any> {
    try {
      const result = await super.transform(files)
      return result
    } catch (error) {
      await Promise.all(files.map((file) => unlink(file.path)))
      throw error
    }
  }
}
