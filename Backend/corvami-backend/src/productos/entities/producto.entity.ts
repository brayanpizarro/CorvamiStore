import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/** Entidad de solo lectura — Inventario.Producto (conexión 'external') */
@Entity({ name: 'Producto', schema: 'Inventario' })
export class Producto {
  @PrimaryColumn()
  id!: number;

  @Column({ nullable: true })
  codigo!: string;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio!: number;

  @Column({ default: 0 })
  stock_actual!: number;

  @Column({ default: 0 })
  stock_minimo!: number;

  @CreateDateColumn({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt!: Date;
}
