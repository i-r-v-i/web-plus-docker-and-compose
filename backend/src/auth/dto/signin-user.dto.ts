import { IsString, Length } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(6)
  password: string;
}
