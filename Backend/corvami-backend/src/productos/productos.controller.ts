import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
// Eliminado almacenamiento local, ahora se sube a Cloudinary

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }

  // Subir imagen a Cloudinary
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Solo se permiten imágenes (jpeg, png, webp, gif)'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) return { error: 'No file uploaded' };
    const result: any = await this.cloudinary.uploadProductImage(id, file.buffer, file.originalname);
    // result.secure_url -> URL pública
    await this.productosService.setImage(id, result.secure_url);
    return { productId: id, imageUrl: result.secure_url };
  }

  // Borrar imagen del producto (Cloudinary + limpiar campo)
  @Delete(':id/image')
  async deleteImage(@Param('id') id: string) {
    await this.cloudinary.deleteProductImage(id);
    await this.productosService.setImage(id, undefined as any);
    return { productId: id, imageDeleted: true };
  }
}
