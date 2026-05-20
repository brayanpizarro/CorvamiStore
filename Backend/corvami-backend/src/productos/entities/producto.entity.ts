import {
  Column,
  Entity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@Index(['name'])
@Index(['category'])
@Index(['brand'])
export class Producto {
  @PrimaryColumn()
  productId: string;

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true, length: 50 })
  category?: string; // Ejemplo: "Teclado", "Mouse", "Laptop", "Monitor"

  @Column({ nullable: true, length: 50 })
  subcategory?: string; // Ejemplo: "Gaming", "Oficina", "Profesional"

  @Column({ nullable: true, length: 50 })
  brand?: string; // Ejemplo: "Corsair", "Logitech", "Razer", "ASUS"

  @Column('simple-array', { nullable: true })
  tags?: string[]; // Ejemplo: ["gaming", "rgb", "inalámbrico", "mecánico"]

  @Column({ default: true })
  isActive: boolean; // Para soft delete

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
