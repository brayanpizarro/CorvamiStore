import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['productId', 'createdAt'])
export class Comment {
  @PrimaryColumn()
  commentId!: string;

  @Column()
  productId!: string;

  @Column()
  userId!: string;

  @Column('int')
  rating!: number;

  @Column({ length: 140, nullable: true })
  title?: string;

  @Column('text')
  content!: string;

  @Column({ type: 'simple-array', nullable: true })
  mediaUrls?: string[];

  @Column({ type: 'simple-array', nullable: true })
  helpfulVotes!: string[];

  @Column({ type: 'simple-array', nullable: true })
  unhelpfulVotes!: string[];

  @Column({ nullable: true })
  parentCommentId?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'published', 'hidden', 'reported'],
    default: 'published',
  })
  status!: 'pending' | 'published' | 'hidden' | 'reported';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
