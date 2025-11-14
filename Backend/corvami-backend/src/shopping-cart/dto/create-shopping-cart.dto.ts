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

export class CartItemDto {
  @IsString()
  productId: string; // UUID del producto

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice?: number; // Precio al momento de agregar

  @IsOptional()
  @IsString()
  name?: string; // Snapshot del nombre del producto
}

export class CreateShoppingCartDto {
  @IsString()
  userId: string; // Cambiado a string para UUID

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items?: CartItemDto[];

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsOptional()
  @IsIn(['active', 'completed', 'abandoned'])
  status?: 'active' | 'completed' | 'abandoned' = 'active';

  @IsOptional()
  @IsString()
  sessionId?: string; // Para carritos de usuarios no autenticados
}
