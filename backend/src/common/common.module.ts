// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './file-upload.service';
import { CloudinaryProvider } from '../config/cloudinary.config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, FileUploadService],
  exports: [FileUploadService],
})
export class CommonModule {}
