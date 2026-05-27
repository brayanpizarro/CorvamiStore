import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VentasPedido } from '../../orders/entities/ventas-pedido.entity';
import { Carrito } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  /** Identificador UUID usado por el sistema de auth / JWT */
  @Column({ unique: true })
  userId: string;

  // ── Campos del esquema ecommerce ────────────────────────────────────────────
  @Column({ nullable: true })
  rut: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ default: 'particular' })
  tipo: string;

  // ── Campos operativos de la aplicación ──────────────────────────────────────
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isRegistered: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  // ── Campos de compatibilidad (uso interno) ──────────────────────────────────
  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ── Relaciones ──────────────────────────────────────────────────────────────
  @OneToMany(() => VentasPedido, (pedido) => pedido.cliente)
  pedidos: VentasPedido[];

  @OneToMany(() => Carrito, (item) => item.cliente)
  carrito: Carrito[];
}
