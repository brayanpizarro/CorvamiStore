import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { VentasPedido } from '../../orders/entities/ventas-pedido.entity';
import { Carrito } from '../../shopping-cart/entities/shopping-cart.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id_cliente!: number;

  // ── Columnas del schema SQL (Ventas.clientes) ───────────────────────────────
  @Column({ length: 12, nullable: true, unique: true })
  rut!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 15, nullable: true })
  telefono!: string;

  @Column({ length: 10, nullable: true })
  tipo!: string;

  // ── Columnas de autenticación (añadidas via ALTER TABLE) ────────────────────
  @Column({ unique: true, nullable: true })
  userId!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isRegistered!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  // ── Relaciones ──────────────────────────────────────────────────────────────
  @OneToMany(() => VentasPedido, (pedido) => pedido.cliente)
  pedidos!: VentasPedido[];

  @OneToMany(() => Carrito, (item) => item.cliente)
  carrito!: Carrito[];
}
