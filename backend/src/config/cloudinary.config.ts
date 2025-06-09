// src/config/cloudinary.config.ts
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY_CONFIG',
  useFactory: (config: ConfigService) => {
    const cn = config.get<string>('CLOUDINARY_CLOUD_NAME');
    const key = config.get<string>('CLOUDINARY_API_KEY');
    const secret = config.get<string>('CLOUDINARY_API_SECRET');
    console.log('☁️ Cloudinary loaded:', { cn, key: !!key });
    return cloudinary.config({
      cloud_name: cn,
      api_key: key,
      api_secret: secret,
    });
  },
  inject: [ConfigService],
};
