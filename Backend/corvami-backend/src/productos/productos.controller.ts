import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { join, extname, basename } from 'path';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

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

  // Subida de imagen del producto
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = join(process.cwd(), 'uploads', 'products');
          fs.mkdirSync(dest, { recursive: true });
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const id = req.params.id;
          const ts = Date.now();
          const ext = extname(file.originalname) || '';
          cb(null, `${id}-${ts}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Solo se permiten imágenes (jpeg, png, webp, gif)'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    const publicUrl = `/uploads/products/${file.filename}`;

    // Borrar imagen anterior si existía y era local
    const existing = await this.productosService.findOne(id);
    const oldUrl: string | undefined = (existing as any)?.imageUrl;
    if (oldUrl && oldUrl.startsWith('/uploads/products/')) {
      const filename = basename(oldUrl);
      const absolutePath = join(process.cwd(), 'uploads', 'products', filename);
      try {
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
      } catch {}
    }

    return this.productosService.setImage(id, publicUrl);
  }
}
