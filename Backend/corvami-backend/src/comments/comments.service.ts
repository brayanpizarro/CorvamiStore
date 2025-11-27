import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  UpdateCommentDto,
  UpdateCommentStatusDto,
} from './dto/update-comment.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: MongoRepository<Comment>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(dto: CreateCommentDto) {
    // Solo permitir reseñas principales (rating > 0) si el usuario compró el producto
    if (dto.rating > 0) {
      const hasPurchased = await this.ordersService.hasUserPurchasedProduct(
        dto.userId,
        dto.productId,
      );

      if (!hasPurchased) {
        throw new ForbiddenException(
          'Solo puedes dejar una reseña si has comprado este producto',
        );
      }
    }

    const entity: Partial<Comment> = {
      commentId: randomUUID(),
      productId: dto.productId,
      userId: dto.userId,
      rating: dto.rating,
      title: dto.title,
      content: dto.content,
      mediaUrls: dto.mediaUrls,
      parentCommentId: dto.parentCommentId,
      helpfulVotes: [],
      unhelpfulVotes: [],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.repo.insert(entity as Comment);
    return {
      commentId: entity.commentId,
      insertedId: result.identifiers[0]?._id,
    };
  }

  async listByProduct(
    productId: string,
    page = 1,
    limit = 10,
    sort: 'new' | 'top' = 'new',
  ) {
    const skip = (page - 1) * limit;
    const order =
      sort === 'new' ? { createdAt: -1 } : { rating: -1, createdAt: -1 };

    // Obtener total de reseñas (sin respuestas)
    const total = await this.repo.count({
      where: { productId, status: 'published', parentCommentId: null } as any,
    });

    // Obtener reseñas paginadas
    const reviews = await this.repo.find({
      where: { productId, status: 'published', parentCommentId: null } as any,
      skip,
      take: limit,
      order,
    } as any);

    return {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
    if (!arr.length)
      return { count: 0, avg: 0, histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const g = arr[0];
    return {
      count: g.count,
      avg: Number(g.avg?.toFixed?.(2) ?? 0),
      histogram: { 1: g.r1, 2: g.r2, 3: g.r3, 4: g.r4, 5: g.r5 },
    };
  }

  async toggleHelpful(commentId: string, userId: string, isHelpful: boolean) {
    const comment = await this.findOneById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    const helpfulVotes = comment.helpfulVotes || [];
    const unhelpfulVotes = comment.unhelpfulVotes || [];

    if (isHelpful) {
      // Toggle helpful
      const hasVoted = helpfulVotes.includes(userId);
      const newHelpfulVotes = hasVoted
        ? helpfulVotes.filter((id) => id !== userId)
        : [...helpfulVotes, userId];

      // Remove from unhelpful if exists
      const newUnhelpfulVotes = unhelpfulVotes.filter((id) => id !== userId);

      await this.repo.updateOne(
        { commentId },
        {
          $set: {
            helpfulVotes: newHelpfulVotes,
            unhelpfulVotes: newUnhelpfulVotes,
            updatedAt: new Date(),
          },
        },
      );

      return {
        helpfulCount: newHelpfulVotes.length,
        unhelpfulCount: newUnhelpfulVotes.length,
        userVote: hasVoted ? null : 'helpful',
      };
    } else {
      // Toggle unhelpful
      const hasVoted = unhelpfulVotes.includes(userId);
      const newUnhelpfulVotes = hasVoted
        ? unhelpfulVotes.filter((id) => id !== userId)
        : [...unhelpfulVotes, userId];

      // Remove from helpful if exists
      const newHelpfulVotes = helpfulVotes.filter((id) => id !== userId);

      await this.repo.updateOne(
        { commentId },
        {
          $set: {
            helpfulVotes: newHelpfulVotes,
            unhelpfulVotes: newUnhelpfulVotes,
            updatedAt: new Date(),
          },
        },
      );

      return {
        helpfulCount: newHelpfulVotes.length,
        unhelpfulCount: newUnhelpfulVotes.length,
        userVote: hasVoted ? null : 'unhelpful',
      };
    }
  }

  async getReplies(parentCommentId: string) {
    return this.repo.find({
      where: { parentCommentId, status: 'published' },
      order: { createdAt: 1 },
    } as any);
  }
}
