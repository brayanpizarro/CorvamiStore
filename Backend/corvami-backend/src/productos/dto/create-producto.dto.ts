import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsPositive,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MaxLength(2000)
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  sku?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  weight?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
