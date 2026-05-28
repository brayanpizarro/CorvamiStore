import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VentasPedido } from './ventas-pedido.entity';

@Entity('ventas_detalle')
export class VentasDetalle {
  @PrimaryGeneratedColumn()
  id_detalle!: number;

  @Column()
  id_pedido!: number;

  /** Referencia al id del producto en la BD externa (Inventario) */
  @Column()
  id_producto!: number;

  @Column()
  cantidad!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unit!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => VentasPedido, (pedido) => pedido.detalles)
  @JoinColumn({ name: 'id_pedido' })
  pedido!: VentasPedido;
}
