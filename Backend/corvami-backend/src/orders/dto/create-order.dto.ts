import {
  IsString,
  IsEmail,
  IsNumber,
  IsArray,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty({ example: 'uuid-del-producto', description: 'ID del producto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 'Camiseta Polo Azul', description: 'Nombre del producto' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2, description: 'Cantidad comprada' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 49990, description: 'Precio unitario' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 99980, description: 'Precio total del ítem (unitPrice × quantity)' })
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../img.jpg', description: 'URL imagen del producto' })
  @IsString()
  @IsOptional()
  image?: string;
}

export class CustomerInfoDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del cliente' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@correo.com', description: 'Correo del cliente' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono de contacto' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Calle 123 #45-67', description: 'Dirección de entrega' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Medellín', description: 'Ciudad' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Antioquia', description: 'Departamento' })
  @IsString()
  department: string;

  @ApiPropertyOptional({ example: '050001', description: 'Código postal' })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiProperty({ example: true, description: 'True si el cliente es invitado (no registrado)' })
  @IsBoolean()
  isGuest: boolean;

  @ApiPropertyOptional({ example: 'uuid-usuario', description: 'ID del usuario autenticado (si aplica)' })
  @IsString()
  @IsOptional()
  userId?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: () => CustomerInfoDto, description: 'Datos del cliente' })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer: CustomerInfoDto;

  @ApiProperty({ type: () => [OrderItemDto], description: 'Lista de productos del pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 99980, description: 'Subtotal sin envío' })
  @IsNumber()
  subtotal: number;

  @ApiProperty({ example: 10000, description: 'Costo de envío' })
  @IsNumber()
  shipping: number;

  @ApiProperty({ example: 109980, description: 'Total a pagar' })
  @IsNumber()
  total: number;

  @ApiPropertyOptional({ example: 'Entregar en horario de la tarde', description: 'Notas adicionales del pedido' })
  @IsString()
  @IsOptional()
  notes?: string;
}
