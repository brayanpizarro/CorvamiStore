import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
  @PrimaryColumn()
  orderId: string;

  @Column({ nullable: true })
  userId?: string;

  @Column('jsonb')
  items: OrderItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column('jsonb')
  shippingInfo: ShippingInfo;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'pending' })
  paymentMethod: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  paidAt?: Date;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
