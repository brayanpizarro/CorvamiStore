import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ProductosService } from './productos.service';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class AddImagenDto {
  @IsString()
  imagenData: string; // base64 o URL

  @IsOptional()
  @IsBoolean()
  esPrincipal?: boolean;
}

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

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
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Datos del producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  // ── Imágenes de producto ─────────────────────────────────────────────────

  @Public()
  @Get(':id/imagenes')
  @ApiOperation({ summary: 'Listar imágenes de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Lista de imágenes.' })
  getImagenes(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.getImagenesByProducto(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/imagenes')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Guardar imagen de un producto en la BD' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiQuery({ name: 'principal', required: false, type: Boolean, description: 'Marcar como imagen principal' })
  @ApiBody({ schema: { type: 'object', properties: { imagenData: { type: 'string', description: 'Imagen en base64 o URL' }, esPrincipal: { type: 'boolean' } } } })
  @ApiResponse({ status: 201, description: 'Imagen guardada.' })
  async addImagen(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddImagenDto,
    @Query('principal') principal?: string,
  ) {
    if (!body.imagenData) throw new BadRequestException('imagenData es requerido');
    const esPrincipal = body.esPrincipal ?? principal === 'true' ?? false;
    return this.productosService.addImagen(id, body.imagenData, esPrincipal);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('imagenes/:imagenId/principal')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Establecer imagen como principal del producto' })
  @ApiParam({ name: 'imagenId', description: 'ID del registro ProductoImagen' })
  @ApiResponse({ status: 200, description: 'Imagen marcada como principal.' })
  setImagenPrincipal(@Param('imagenId', ParseIntPipe) imagenId: number) {
    return this.productosService.setImagenPrincipal(imagenId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('imagenes/:imagenId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar imagen de un producto' })
  @ApiParam({ name: 'imagenId', description: 'ID del registro ProductoImagen' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada.' })
  async deleteImagen(@Param('imagenId', ParseIntPipe) imagenId: number) {
    await this.productosService.removeImagen(imagenId);
    return { deleted: true, imagenId };
  }
}
