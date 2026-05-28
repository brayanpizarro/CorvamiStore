import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { VentasPedido } from './ventas-pedido.entity';

@Entity('ventas_factura')
export class VentasFactura {
  @PrimaryGeneratedColumn()
  id_factura!: number;

  @Column()
  id_pedido!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_emision!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_neto!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @OneToOne(() => VentasPedido, (pedido) => pedido.factura)
  @JoinColumn({ name: 'id_pedido' })
  pedido!: VentasPedido;
}
