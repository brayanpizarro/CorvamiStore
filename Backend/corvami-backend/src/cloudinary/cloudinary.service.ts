import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

// Se asume que las variables de entorno están definidas:
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

@Injectable()
export class CloudinaryService {
  async uploadProductImage(
    productId: string,
    buffer: Buffer,
    originalName: string,
  ) {
    const ext = originalName.includes('.')
      ? originalName.substring(originalName.lastIndexOf('.') + 1)
      : 'jpg';
    const publicId = `products/${productId}`; // sobreescribe siempre la misma
    const options: UploadApiOptions = {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      folder: undefined, // ya está en public_id con prefijo products/
      format: ext === 'jpeg' ? 'jpg' : ext,
    };
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      upload.end(buffer);
    });
  }

  async deleteProductImage(productId: string) {
    const publicId = `products/${productId}`;
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
    return res;
  }
}
