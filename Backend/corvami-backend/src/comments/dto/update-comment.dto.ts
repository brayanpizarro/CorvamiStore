import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}

export class UpdateCommentStatusDto {
  @IsIn(['pending', 'published', 'hidden', 'reported'])
  status: 'pending' | 'published' | 'hidden' | 'reported';

  @IsOptional()
  @IsString()
  moderatorNote?: string;
}
