import { Column, Entity, Index, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['userId'], { unique: true })
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string; // UUID

  @Column()
  email: string;

  @Column()
  password: string; // Hasheado

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
