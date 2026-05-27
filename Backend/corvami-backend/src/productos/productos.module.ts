import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from './entities/producto.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  // 'external' = conexión a la BD de Inventario (solo lectura)
  imports: [TypeOrmModule.forFeature([Producto], 'external')],
  controllers: [ProductosController],
  providers: [ProductosService, CloudinaryService],
  exports: [ProductosService],
})
export class ProductosModule {}
