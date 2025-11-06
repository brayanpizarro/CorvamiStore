import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

// DTO básico que hereda de CreateProductoDto pero hace todos los campos opcionales
export class UpdateProductoDto extends PartialType(CreateProductoDto) {}

// DTO específico para actualizar solo el stock (operaciones frecuentes)
export class UpdateStockDto {
  @IsNumber()
  @Min(0)
  stock: number;
}

// DTO específico para actualizar solo el precio
export class UpdatePriceDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}

// DTO para activar/desactivar productos
export class UpdateProductStatusDto {
  @IsBoolean()
  isActive: boolean;
}

// DTO para actualización masiva de productos (por categoría, etc.)
export class BulkUpdateProductoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  priceMultiplier?: number; // Para aplicar descuentos/aumentos porcentuales
}

// DTO para operaciones de inventario
export class InventoryUpdateDto {
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  operation?: 'set' | 'add' | 'subtract'; // Tipo de operación en el stock
}
