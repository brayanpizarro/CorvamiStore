import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoImagen } from './entities/producto-imagen.entity';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ProductosService {
  constructor(
    // Conexión 'default' → schema Ventas (tabla propia de imágenes)
    @InjectRepository(ProductoImagen)
    private readonly imagenRepo: Repository<ProductoImagen>,

    private readonly inventoryService: InventoryService,
  ) {}

  // ── Productos — datos desde el servicio de Inventario ────────────────────

  findAll() {
    return this.inventoryService.getStock();
  }

  findOne(id: string | number) {
    return this.inventoryService.getStockById(Number(id));
  }

  // ── Imágenes de producto (tabla propia en schema Ventas) ─────────────────

  async addImagen(
    productoId: number,
    imagenData: string,
    esPrincipal = false,
  ): Promise<ProductoImagen> {
    if (esPrincipal) {
      await this.imagenRepo.update({ productoId }, { esPrincipal: false });
    }
    const imagen = this.imagenRepo.create({
      productoId,
      imagenData,
      esPrincipal,
    });
    return this.imagenRepo.save(imagen);
  }

  getImagenesByProducto(productoId: number): Promise<ProductoImagen[]> {
    return this.imagenRepo.find({
      where: { productoId },
      order: { esPrincipal: 'DESC', createdAt: 'ASC' },
    });
  }

  async getImagenById(id: number): Promise<ProductoImagen> {
    const imagen = await this.imagenRepo.findOneBy({ id });
    if (!imagen) {
      throw new NotFoundException(`Imagen con id ${id} no encontrada`);
    }
    return imagen;
  }

  async removeImagen(id: number): Promise<void> {
    const imagen = await this.getImagenById(id);
    await this.imagenRepo.remove(imagen);
  }

  async setImagenPrincipal(id: number): Promise<ProductoImagen> {
    const imagen = await this.getImagenById(id);
    await this.imagenRepo.update(
      { productoId: imagen.productoId },
      { esPrincipal: false },
    );
    imagen.esPrincipal = true;
    return this.imagenRepo.save(imagen);
  }
}
