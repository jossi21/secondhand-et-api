import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { UploadResponse } from '../usecase/upload.response';

cloudinary.config();

const MAX_FILE_SIZE_BYTES =
  Number(process.env.UPLOAD_MAX_FILE_SIZE_MB ?? '5') * 1024 * 1024;

const ALLOWED_MIME_TYPES = (
  process.env.UPLOAD_ALLOWED_MIME_TYPES ?? 'image/jpeg,image/png,image/webp'
)
  .split(',')
  .map((t) => t.trim())
  .filter(Boolean);

const UPLOAD_FOLDER: string =
  process.env.NODE_ENV === 'production' ? 'secondhand-et' : 'secondhand-et-dev';

interface CloudinaryFile extends Express.Multer.File {
  path: string;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: UPLOAD_FOLDER,
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  }),
});

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
  @Post('image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
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
  uploadImage(@UploadedFile() file: CloudinaryFile): UploadResponse {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const response = new UploadResponse();
    response.url = file.path;
    return response;
  }
}
