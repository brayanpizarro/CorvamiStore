import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string; // UUID único

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ default: 0 })
  balance: number; // Saldo disponible

  @Column({ default: false })
  isRegistered: boolean; // true = usuario registrado, false = usuario invitado

  @Column({ nullable: true })
  password?: string; // Solo para usuarios registrados

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
