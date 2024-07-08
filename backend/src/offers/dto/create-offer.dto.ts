import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  @IsPositive()
  itemId: number;
}
