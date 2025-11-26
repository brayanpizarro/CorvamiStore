import { IsString, IsEmail, IsNumber, IsArray, IsOptional, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  image?: string;
}

export class CustomerInfoDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  department: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsBoolean()
  isGuest: boolean;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer: CustomerInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  shipping: number;

  @IsNumber()
  total: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
