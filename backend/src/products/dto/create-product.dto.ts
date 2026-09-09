import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity.js';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsUUID()
  collection_id?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sale_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost_price?: number;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  metal_type?: string;

  @IsOptional()
  @IsString()
  purity?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  stone_type?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
