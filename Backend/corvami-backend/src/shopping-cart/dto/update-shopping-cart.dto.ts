import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateShoppingCartDto } from './create-shopping-cart.dto';

export class UpdateShoppingCartDto extends PartialType(CreateShoppingCartDto) {}

// DTO específico para operaciones de carrito en Redis
export class AddItemToCartDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto a agregar' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 1, description: 'Cantidad a agregar' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: 49990, description: 'Precio unitario' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  unitPrice?: number;

  @ApiPropertyOptional({ example: 'Camiseta Polo Azul', description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../img.jpg', description: 'URL imagen del producto' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto a actualizar' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 3, description: 'Nueva cantidad' })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class RemoveItemFromCartDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto a eliminar' })
  @IsString()
  productId: string;
}

export class CartOperationDto {
  @ApiProperty({ enum: ['add', 'update', 'remove', 'clear'], description: 'Operación a realizar' })
  @IsIn(['add', 'update', 'remove', 'clear'])
  operation: 'add' | 'update' | 'remove' | 'clear';

  @ApiPropertyOptional({ example: 'uuid-del-producto', description: 'ID del producto (requerido para add/update/remove)' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ example: 2, description: 'Cantidad (requerida para add/update)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;
}
