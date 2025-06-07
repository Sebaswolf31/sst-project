// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Module({
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class CommonModule {}
