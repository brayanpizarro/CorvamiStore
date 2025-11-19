import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateCommentStatusDto } from './dto/update-comment.dto';

@Controller('productos/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Param('productId') productId: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create({ ...dto, productId });
  }

  @Get()
  list(
    @Param('productId') productId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sort') sort: 'new' | 'top' = 'new',
  ) {
    return this.commentsService.listByProduct(productId, Number(page), Number(limit), sort);
  }

  @Get('/summary')
  summary(@Param('productId') productId: string) {
    return this.commentsService.ratingsSummary(productId);
  }

  @Patch(':commentId')
  update(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    // productId no se usa directamente, pero valida la ruta
    return this.commentsService.update(commentId, dto);
  }

  @Patch(':commentId/status')
  updateStatus(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentStatusDto,
  ) {
    return this.commentsService.updateStatus(commentId, dto);
  }

  @Delete(':commentId')
  remove(@Param('productId') productId: string, @Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
