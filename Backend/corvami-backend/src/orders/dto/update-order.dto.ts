import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  canal?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsDateString()
  @IsOptional()
  paidAt?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  id_empleado?: number;
}
