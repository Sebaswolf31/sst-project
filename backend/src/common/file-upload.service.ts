import { Injectable, BadRequestException } from '@nestjs/common';
import { cloudinary } from '../config/cloudinary.config';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileUploadService {
  async saveFile(
    file: Express.Multer.File,
    folder: string = 'inspections',
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf'],
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}`,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('El archivo excede el tamaño máximo (5MB)');
    }

    try {
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          Cloudinary.uploader
            .upload_stream(
              {
                folder,
                resource_type: 'auto',
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse); // forzamos el tipo aquí
              },
            )
            .end(file.buffer);
        },
      );

      return uploadResult.secure_url;
    } catch (error) {
      throw new BadRequestException(
        `Error al subir el archivo: ${error.message}`,
      );
    }
  }

  async deleteFile(publicUrl: string): Promise<void> {
    try {
      // Extraer public_id desde la URL de Cloudinary
      const publicIdMatch = publicUrl.match(/\/v\d+\/([^\.\/]+)\.\w+$/);
      if (!publicIdMatch) return;

      const publicId = publicIdMatch[1];
      await Cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error al eliminar archivo en Cloudinary', error);
    }
  }
}
