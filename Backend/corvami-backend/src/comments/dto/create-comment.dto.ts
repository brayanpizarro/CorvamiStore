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

export class CreateCommentDto {
  @IsString()
  productId: string; // uuid del producto (productId)

  @IsString()
  userId: string; // uuid del usuario

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  title?: string;

  @IsString()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @IsUrl({ require_protocol: true }, { each: true })
  mediaUrls?: string[];

  @IsOptional()
  @IsString()
  parentCommentId?: string; // Para respuestas a reseñas
}
