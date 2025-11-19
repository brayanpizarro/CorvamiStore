import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateCommentStatusDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: MongoRepository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    const entity: Partial<Comment> = {
      commentId: randomUUID(),
      productId: dto.productId,
      userId: dto.userId,
      rating: dto.rating,
      title: dto.title,
      content: dto.content,
      mediaUrls: dto.mediaUrls,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.repo.insert(entity as Comment);
    return { commentId: entity.commentId, insertedId: result.identifiers[0]?._id };
  }

  listByProduct(productId: string, page = 1, limit = 10, sort: 'new' | 'top' = 'new') {
    const skip = (page - 1) * limit;
    const order = sort === 'new' ? { createdAt: -1 } : { rating: -1, createdAt: -1 };
    return this.repo.find({
      where: { productId, status: 'published' },
      skip,
      take: limit,
      order,
    } as any);
  }

  findOneById(commentId: string) {
    return this.repo.findOneBy({ commentId });
  }

  async update(commentId: string, dto: UpdateCommentDto) {
    const result = await this.repo.updateOne(
      { commentId },
      { $set: { ...dto, updatedAt: new Date() } },
    );
    return { matched: result.matchedCount, modified: result.modifiedCount };
  }

  async updateStatus(commentId: string, dto: UpdateCommentStatusDto) {
    const result = await this.repo.updateOne(
      { commentId },
      { $set: { status: dto.status, updatedAt: new Date() } },
    );
    return { matched: result.matchedCount, modified: result.modifiedCount };
  }

  async remove(commentId: string) {
    const result = await this.repo.deleteOne({ commentId });
    return { deleted: result.deletedCount };
  }

  async ratingsSummary(productId: string) {
    const cursor = this.repo.aggregate([
      { $match: { productId, status: 'published' } },
      {
        $group: {
          _id: '$productId',
          count: { $sum: 1 },
          avg: { $avg: '$rating' },
          r1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          r2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          r3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          r4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          r5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        },
      },
    ]);
    const arr = await cursor.toArray();
    if (!arr.length) return { count: 0, avg: 0, histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const g = arr[0];
    return { count: g.count, avg: Number(g.avg?.toFixed?.(2) ?? 0), histogram: { 1: g.r1, 2: g.r2, 3: g.r3, 4: g.r4, 5: g.r5 } };
  }
}
