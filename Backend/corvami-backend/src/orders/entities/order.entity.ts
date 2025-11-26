import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  zipCode?: string;
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
  subtotal: number; // Subtotal de productos

  @Column()
  shippingCost: number; // Costo de envío

  @Column()
  total: number; // Total de la orden

  @Column()
  shippingInfo: ShippingInfo; // Información de envío

  @Column({ default: 'pending' })
  status: string; // pending, paid, processing, shipped, delivered, cancelled

  @Column({ default: 'pending' })
  paymentMethod: string; // pending, credit_card, etc.

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
