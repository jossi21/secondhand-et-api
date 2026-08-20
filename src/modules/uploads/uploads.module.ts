import { Module } from '@nestjs/common';
import { UploadController } from './controller/uploads.controller';

@Module({
  controllers: [UploadController],
})
export class UploadsModule {}
