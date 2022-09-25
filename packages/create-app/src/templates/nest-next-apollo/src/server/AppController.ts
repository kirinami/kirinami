import path from 'path';

import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';

@Controller()
export default class AppController {
  @UseInterceptors(
    FilesInterceptor('files', 6, {
      storage: diskStorage({
        destination: path.resolve('public/uploads'),
        filename(req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
          const filename = v4();
          const extension = path.extname(file.originalname).toLowerCase();

          callback(null, `${filename}${extension}`);
        },
      }),
    })
  )
  @Post('uploads')
  uploads(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
      mimetype: file.mimetype,
      filename: file.filename,
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));
  }
}
