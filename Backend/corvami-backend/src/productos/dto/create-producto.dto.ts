import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 'Camiseta Polo Azul', description: 'Nombre del producto', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Camiseta de algodón de alta calidad...', description: 'Descripción detallada', maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiProperty({ example: 49990, description: 'Precio del producto (máx. 2 decimales)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 100, description: 'Unidades disponibles en inventario', minimum: 0 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'Ropa', description: 'Categoría principal', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ example: 'Camisetas', description: 'Subcategoría', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  subcategory?: string;

  @ApiPropertyOptional({ example: 'CorvamiStore', description: 'Marca del producto', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  brand?: string;

  @ApiPropertyOptional({ example: ['polo', 'hombre', 'azul'], description: 'Etiquetas del producto', type: [String] })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ example: 'CAM-POLO-AZL-M', description: 'Código SKU único', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({ example: 0.3, description: 'Peso en kg (máx. 2 decimales)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weight?: number;

  @ApiPropertyOptional({ example: true, description: 'Indica si el producto está activo y visible' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
