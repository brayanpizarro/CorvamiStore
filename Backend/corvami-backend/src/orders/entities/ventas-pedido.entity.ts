import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../users/entities/user.entity';
import { VentasDetalle } from './ventas-detalle.entity';
import { VentasFactura } from './ventas-factura.entity';

@Entity('ventas_pedido')
export class VentasPedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column({ nullable: true })
  id_cliente: number;

  /** Referencia al id del empleado en la BD externa (RRHH) */
  @Column({ nullable: true })
  id_empleado: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_envio: number;

  @Column({ default: 'online' })
  canal: string;

  // ── Campos operativos ──────────────────────────────────────────────────────
  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  paidAt?: Date;

  @Column({ default: 'pendiente' })
  paymentMethod: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  /** Info de envío almacenada como JSON (para invitados sin cuenta) */
  @Column({ type: 'jsonb', nullable: true })
  shippingInfo?: Record<string, any>;

  /** Identificador externo de la orden (para invitados) */
  @Column({ nullable: true })
  userId?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  // ── Relaciones locales ─────────────────────────────────────────────────────
  @ManyToOne(() => Cliente, (cliente) => cliente.pedidos, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @OneToMany(() => VentasDetalle, (detalle) => detalle.pedido, { cascade: true })
  detalles: VentasDetalle[];

  @OneToOne(() => VentasFactura, (factura) => factura.pedido, { cascade: true })
  factura: VentasFactura;
}
