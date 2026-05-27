import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger(ProductosService.name);

  constructor(
    // Conexión 'external' → BD de Inventario (solo lectura)
    @InjectRepository(Producto, 'external')
    private readonly repo: Repository<Producto>,
  ) {}

  /** Solo lectura — los productos viven en el Inventario externo */
  findAll() {
    return this.repo.find();
  }

  findOne(id: string | number) {
    return this.repo.findOneBy({ id_producto: Number(id) });
  }

  // ── Operaciones de escritura ─────────────────────────────────────────────
  // La BD de Inventario es externa (solo lectura).
  // Se mantienen los métodos para no romper importadores existentes,
  // pero no persisten datos.

  async create(_dto: any) {
    this.logger.warn('create() ignorado: productos es una tabla externa (solo lectura)');
    return { id_producto: null };
  }

  async update(id: string | number, _dto: any) {
    this.logger.warn(`update(${id}) ignorado: productos es una tabla externa (solo lectura)`);
    return { affected: 0 };
  }

  async remove(id: string | number) {
    this.logger.warn(`remove(${id}) ignorado: productos es una tabla externa (solo lectura)`);
    return { deleted: 0 };
  }

  async setImage(id: string | number, _imageUrl: string) {
    this.logger.warn(`setImage(${id}) ignorado: productos es una tabla externa (solo lectura)`);
    return { affected: 0 };
  }

  async reduceStock(id: string | number, _quantity: number) {
    this.logger.warn(`reduceStock(${id}) ignorado: stock gestionado por Inventario externo`);
    return { affected: 0 };
  }
}
