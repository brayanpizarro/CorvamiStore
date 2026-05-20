import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
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
    private readonly repo: Repository<Comment>,
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

    const entity = this.repo.create({
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
      status: 'published' as const,
    });
    const saved = await this.repo.save(entity);
    return { commentId: saved.commentId };
  }

  async listByProduct(
    productId: string,
    page = 1,
    limit = 10,
    sort: 'new' | 'top' = 'new',
  ) {
    const skip = (page - 1) * limit;
    const order =
      sort === 'new'
        ? { createdAt: 'DESC' as const }
        : { rating: 'DESC' as const, createdAt: 'DESC' as const };

    const [reviews, total] = await this.repo.findAndCount({
      where: { productId, status: 'published', parentCommentId: IsNull() },
      skip,
      take: limit,
      order,
    });

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
    const result = await this.repo.update({ commentId }, { ...dto });
    return { affected: result.affected };
  }

  async updateStatus(commentId: string, dto: UpdateCommentStatusDto) {
    const result = await this.repo.update({ commentId }, { status: dto.status });
    return { affected: result.affected };
  }

  async remove(commentId: string) {
    const result = await this.repo.delete({ commentId });
    return { deleted: result.affected };
  }

  async ratingsSummary(productId: string) {
    const result = await this.repo
      .createQueryBuilder('comment')
      .select('COUNT(*)', 'count')
      .addSelect('AVG(comment.rating)', 'avg')
      .addSelect("SUM(CASE WHEN comment.rating = 1 THEN 1 ELSE 0 END)", 'r1')
      .addSelect("SUM(CASE WHEN comment.rating = 2 THEN 1 ELSE 0 END)", 'r2')
      .addSelect("SUM(CASE WHEN comment.rating = 3 THEN 1 ELSE 0 END)", 'r3')
      .addSelect("SUM(CASE WHEN comment.rating = 4 THEN 1 ELSE 0 END)", 'r4')
      .addSelect("SUM(CASE WHEN comment.rating = 5 THEN 1 ELSE 0 END)", 'r5')
      .where('comment.productId = :productId', { productId })
      .andWhere("comment.status = 'published'")
      .getRawOne();

    if (!result || Number(result.count) === 0) {
      return { count: 0, avg: 0, histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    return {
      count: Number(result.count),
      avg: Number(Number(result.avg).toFixed(2)),
      histogram: {
        1: Number(result.r1),
        2: Number(result.r2),
        3: Number(result.r3),
        4: Number(result.r4),
        5: Number(result.r5),
      },
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
      const hasVoted = helpfulVotes.includes(userId);
      comment.helpfulVotes = hasVoted
        ? helpfulVotes.filter((id) => id !== userId)
        : [...helpfulVotes, userId];
      comment.unhelpfulVotes = unhelpfulVotes.filter((id) => id !== userId);
      await this.repo.save(comment);
      return {
        helpfulCount: comment.helpfulVotes.length,
        unhelpfulCount: comment.unhelpfulVotes.length,
        userVote: hasVoted ? null : 'helpful',
      };
    } else {
      const hasVoted = unhelpfulVotes.includes(userId);
      comment.unhelpfulVotes = hasVoted
        ? unhelpfulVotes.filter((id) => id !== userId)
        : [...unhelpfulVotes, userId];
      comment.helpfulVotes = helpfulVotes.filter((id) => id !== userId);
      await this.repo.save(comment);
      return {
        helpfulCount: comment.helpfulVotes.length,
        unhelpfulCount: comment.unhelpfulVotes.length,
        userVote: hasVoted ? null : 'unhelpful',
      };
    }
  }

  async getReplies(parentCommentId: string) {
    return this.repo.find({
      where: { parentCommentId, status: 'published' },
      order: { createdAt: 'ASC' },
    });
  }
}
