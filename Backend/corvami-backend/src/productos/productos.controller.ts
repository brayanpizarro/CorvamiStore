import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// Eliminado almacenamiento local, ahora se sube a Cloudinary

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productosService: ProductosService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  findAll() {
    return this.productosService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Datos del producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado.' })
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado.' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }

  // Subir imagen a Cloudinary
  @UseGuards(JwtAuthGuard)
  @Post(':id/image')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Subir imagen de un producto a Cloudinary' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary', description: 'Imagen (jpeg, png, webp, gif) máx. 5MB' } } } })
  @ApiResponse({ status: 201, description: 'Imagen subida. Retorna la URL pública.' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpeg, png, webp, gif)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) return { error: 'No file uploaded' };
    const result: any = await this.cloudinary.uploadProductImage(
      id,
      file.buffer,
      file.originalname,
    );
    // result.secure_url -> URL pública
    await this.productosService.setImage(id, result.secure_url);
    return { productId: id, imageUrl: result.secure_url };
  }

  // Borrar imagen del producto (Cloudinary + limpiar campo)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/image')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar imagen de un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada.' })
  async deleteImage(@Param('id') id: string) {
    await this.cloudinary.deleteProductImage(id);
    await this.productosService.setImage(id, undefined as any);
    return { productId: id, imageDeleted: true };
  }
}
