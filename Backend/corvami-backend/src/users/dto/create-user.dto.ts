import {
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@correo.com', description: 'Correo electrónico' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: '3001234567', description: 'Teléfono' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 0, description: 'Saldo disponible en la cuenta' })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({ example: true, description: 'Indica si el usuario completó el registro' })
  @IsBoolean()
  @IsOptional()
  isRegistered?: boolean;

  @ApiPropertyOptional({ example: 'contraseña123', description: 'Contraseña (mínimo 6 caracteres)', minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;
}
