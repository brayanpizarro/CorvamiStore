import {
  Entity,
  ObjectIdColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
@Index(['productId', 'createdAt'])
export class Comment {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  commentId: string; // uuid

  @Column()
  productId: string; // uuid del Producto (productId)

  @Column()
  userId: string; // uuid del usuario

  @Column('int')
  rating: number; // 1-5

  @Column({ length: 140, nullable: true })
  title?: string;

  @Column('text')
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  mediaUrls?: string[]; // opcional

  @Column({ type: 'simple-array', default: [] })
  helpfulVotes: string[]; // Array de userIds que marcaron como útil

  @Column({ type: 'simple-array', default: [] })
  unhelpfulVotes: string[]; // Array de userIds que marcaron como no útil

  @Column({ nullable: true })
  parentCommentId?: string; // Para respuestas a reseñas

  @Column({
    type: 'enum',
    enum: ['pending', 'published', 'hidden', 'reported'],
    default: 'published',
  })
  status: 'pending' | 'published' | 'hidden' | 'reported';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
