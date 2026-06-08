import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto' })
  @IsString()
  productId: string; // UUID del producto

  @ApiProperty({ example: 2, description: 'Cantidad del producto' })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({ example: 49990, description: 'Precio unitario al momento de agregar' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice?: number; // Precio al momento de agregar

  @ApiPropertyOptional({ example: 'Camiseta Polo Azul', description: 'Snapshot del nombre del producto' })
  @IsOptional()
  @IsString()
  name?: string; // Snapshot del nombre del producto

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../img.jpg', description: 'URL de la imagen del producto' })
  @IsOptional()
  @IsString()
  image?: string; // URL de la imagen del producto
}

export class CreateShoppingCartDto {
  @ApiPropertyOptional({ example: 'uuid-usuario', description: 'ID del usuario autenticado (opcional)' })
  @IsOptional()
  @IsString()
  userId?: string; // Opcional - UUID del usuario autenticado

  @ApiPropertyOptional({ type: () => [CartItemDto], description: 'Items iniciales del carrito' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items?: CartItemDto[];

  @ApiPropertyOptional({ example: 'USD', description: 'Moneda del carrito' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'completed', 'abandoned'], description: 'Estado del carrito' })
  @IsOptional()
  @IsIn(['active', 'completed', 'abandoned'])
  status?: 'active' | 'completed' | 'abandoned' = 'active';

  @ApiPropertyOptional({ example: 'session-abc-123', description: 'ID de sesión para usuarios no autenticados' })
  @IsOptional()
  @IsString()
  sessionId?: string; // Para carritos de usuarios no autenticados
}
