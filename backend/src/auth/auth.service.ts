import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(signInUserDto: SignInUserDto) {
    const user = await this.usersService.findByUsername(signInUserDto.username);
    const passwordIsMatch = await bcrypt.compare(
      signInUserDto.password,
      user.password,
    );
    if (passwordIsMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    throw null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      username: user.username,
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }
}
