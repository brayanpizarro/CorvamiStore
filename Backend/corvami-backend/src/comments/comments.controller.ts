import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  UpdateCommentDto,
  UpdateCommentStatusDto,
} from './dto/update-comment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comments')
@Controller('productos/:productId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Crear una reseña/comentario en un producto' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiResponse({ status: 201, description: 'Comentario creado.' })
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create({
      ...dto,
      productId,
      userId: user.userId,
    });
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar comentarios de un producto (paginado)' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Comentarios por página' })
  @ApiQuery({ name: 'sort', required: false, enum: ['new', 'top'], description: 'Ordenamiento' })
  @ApiResponse({ status: 200, description: 'Lista paginada de comentarios.' })
  list(
    @Param('productId') productId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sort') sort: 'new' | 'top' = 'new',
  ) {
    return this.commentsService.listByProduct(
      productId,
      Number(page),
      Number(limit),
      sort,
    );
  }

  @Public()
  @Get('/summary')
  @ApiOperation({ summary: 'Resumen de calificaciones de un producto' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Promedio y distribución de ratings.' })
  summary(@Param('productId') productId: string) {
    return this.commentsService.ratingsSummary(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Editar un comentario' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario' })
  @ApiResponse({ status: 200, description: 'Comentario actualizado.' })
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
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Cambiar estado de un comentario (aprobado/rechazado)' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario' })
  @ApiResponse({ status: 200, description: 'Estado actualizado.' })
  updateStatus(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentStatusDto,
  ) {
    return this.commentsService.updateStatus(commentId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar un comentario' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario' })
  @ApiResponse({ status: 200, description: 'Comentario eliminado.' })
  remove(
    @Param('productId') productId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':commentId/helpful')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Marcar comentario como útil' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario' })
  @ApiResponse({ status: 201, description: 'Marcado como útil.' })
  markHelpful(@Param('commentId') commentId: string, @CurrentUser() user: any) {
    return this.commentsService.toggleHelpful(commentId, user.userId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':commentId/unhelpful')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Marcar comentario como no útil' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario' })
  @ApiResponse({ status: 201, description: 'Marcado como no útil.' })
  markUnhelpful(
    @Param('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.toggleHelpful(commentId, user.userId, false);
  }

  @Public()
  @Get(':commentId/replies')
  @ApiOperation({ summary: 'Obtener respuestas de un comentario' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiParam({ name: 'commentId', description: 'UUID del comentario padre' })
  @ApiResponse({ status: 200, description: 'Lista de respuestas.' })
  getReplies(@Param('commentId') commentId: string) {
    return this.commentsService.getReplies(commentId);
  }
}
