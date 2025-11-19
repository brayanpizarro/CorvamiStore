import { Column, Entity, Index, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
@Index(['name'])
export class Producto {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  productId: string; // UUID asignado en el servicio

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
