import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { UploadResponse } from '../usecase/upload.response';

const UPLOAD_DEST = process.env.UPLOAD_DEST ?? './uploads';

const MAX_FILE_SIZE_BYTES =
  Number(process.env.UPLOAD_MAX_FILE_SIZE_MB ?? '5') * 1024 * 1024;

const ALLOWED_MIME_TYPES = (
  process.env.UPLOAD_ALLOWED_MIME_TYPES ?? 'image/jpeg,image/png,image/webp'
)
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DEST,
        filename: (_req, file, callback) => {
          const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              `Unsupported file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File): UploadResponse {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const response = new UploadResponse();
    response.url = `/uploads/${file.filename}`;

    return response;
  }
}
