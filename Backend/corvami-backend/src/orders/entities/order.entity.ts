import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

@Entity('orders')
export class Order {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  orderId: string; // UUID único

  @Column({ nullable: true })
  userId?: string; // ID del usuario (null para invitados)

  @Column()
  items: OrderItem[]; // Productos de la orden

  @Column()
  total: number; // Total de la orden

  @Column()
  shippingInfo: ShippingInfo; // Información de envío

  @Column({ default: 'pending' })
  status: string; // pending, paid, shipped, delivered, cancelled

  @Column({ default: 'balance' })
  paymentMethod: string; // balance, credit_card, etc.

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
