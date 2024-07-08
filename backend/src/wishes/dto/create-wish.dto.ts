import { IsInt, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  image: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  @Length(1, 1024, { message: 'должно быть не меньше 1 и не больше 1024' })
  description?: string;
}
