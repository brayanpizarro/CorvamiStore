import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {}

// DTO específico para operaciones de carrito en Redis
export class AddItemToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCartItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class RemoveItemFromCartDto {
  @IsString()
  productId: string;
}

export class CartOperationDto {
  @IsIn(['add', 'update', 'remove', 'clear'])
  operation: 'add' | 'update' | 'remove' | 'clear';

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
