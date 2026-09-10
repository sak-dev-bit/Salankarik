import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { DiscountType, DiscountStatus } from '../entities/discount.entity.js';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  type: DiscountType;

  @IsString()
  @IsNotEmpty()
  code: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_order?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_discount?: number;

  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @IsOptional()
  @IsEnum(DiscountStatus)
  status?: DiscountStatus;
}
