import { IsArray, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
