import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdjustInventoryDto {
  @IsInt()
  @IsNotEmpty()
  change_qty: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
