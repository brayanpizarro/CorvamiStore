import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto, UpdateCommentStatusDto } from './dto/update-comment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('productos/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Post()
  create(@Param('productId') productId: string, @Body() dto: CreateCommentDto) {
    return this.commentsService.create({ ...dto, productId });
  }

  @Public()
  @Get()
  list(
    @Param('productId') productId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sort') sort: 'new' | 'top' = 'new',
  ) {
    return this.commentsService.listByProduct(productId, Number(page), Number(limit), sort);
  }

  @Public()
  @Get('/summary')
  summary(@Param('productId') productId: string) {
    return this.commentsService.ratingsSummary(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  update(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
  ) {
    // productId no se usa directamente, pero valida la ruta
    return this.commentsService.update(commentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId/status')
  updateStatus(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentStatusDto,
  ) {
    return this.commentsService.updateStatus(commentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(@Param('productId') productId: string, @Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
