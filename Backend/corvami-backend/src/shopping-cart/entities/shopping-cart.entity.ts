import { Producto } from 'src/productos/entities/producto.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('jsonb')
  items: CartItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  currency: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'completed', 'abandoned'],
    default: 'active',
  })
  status: 'active' | 'completed' | 'abandoned';
}

export interface CartItem {
  productId: string;
  quantity: number;
}
