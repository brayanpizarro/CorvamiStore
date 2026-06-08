import {
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  MaxLength,
  IsOptional,
  IsUrl,
  IsArray,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto a comentar' })
  @IsString()
  productId: string; // uuid del producto (productId)

  @ApiProperty({ example: 'uuid-del-usuario', description: 'ID del usuario que comenta' })
  @IsString()
  userId: string; // uuid del usuario

  @ApiProperty({ example: 5, description: 'Calificación del 1 al 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: '¡Excelente producto!', description: 'Título del comentario (máx. 140 caracteres)', maxLength: 140 })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  title?: string;

  @ApiProperty({ example: 'La calidad es increíble, llegó a tiempo y en perfecto estado.', description: 'Contenido del comentario (máx. 5000 caracteres)', maxLength: 5000 })
  @IsString()
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({ example: ['https://res.cloudinary.com/.../foto1.jpg'], description: 'URLs de imágenes/videos (máx. 6)', type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsUrl({ require_protocol: true }, { each: true })
  mediaUrls?: string[];

  @ApiPropertyOptional({ example: 'uuid-comentario-padre', description: 'ID del comentario padre (para respuestas)' })
  @IsOptional()
  @IsString()
  parentCommentId?: string; // Para respuestas a reseñas
}
