import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Entidad de solo lectura mapeada a la tabla 'productos'
 * en la base de datos externa de Inventario (conexión 'external').
 */
@Entity('productos')
export class Producto {
  @PrimaryColumn()
  id_producto: number;

  @Column({ nullable: true })
  codigo: string;

  @Column()
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unit: number;

  @Column({ default: 0 })
  stock_actual: number;

  @Column({ nullable: true })
  categoria: string;
}
