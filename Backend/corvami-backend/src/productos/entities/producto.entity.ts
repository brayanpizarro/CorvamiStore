import { min } from 'rxjs';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity
@Index(['name'])
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column({ length: 50 })
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
