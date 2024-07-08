import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findBy([
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]);
    if (existUser.length > 0)
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );

    const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const newUser = await this.userRepository.save({
      ...createUserDto,
      password: hash,
    });
    return newUser;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('user not Found');
    }
    return user;
  }

  async findMany(query: string) {
    const queryString = Like(`%${query}%`);
    const user = await this.userRepository.findBy([
      { username: queryString },
      { email: queryString },
    ]);

    if (!user) {
      throw new NotFoundException(`Пользователь не существует`);
    }
    return user;
  }

  async getMyWishes(userId: number) {
    return await this.wishRepository.findBy({
      owner: { id: userId },
    });
  }

  async getUserWishes(username: string) {
    return await this.wishRepository.findBy({
      owner: { username: username },
    });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const usernameExists =
      updateUserDto.username &&
      (await this.userRepository.findOneBy({
        username: updateUserDto.username,
      }));
    const emailExists =
      updateUserDto.email &&
      (await this.userRepository.findOneBy({ email: updateUserDto.email }));

    if (usernameExists || emailExists) {
      throw new ConflictException(
        'Пользователь с таким логином или email уже существует',
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }
    await this.userRepository.update(userId, updateUserDto);
    return await this.userRepository.findOneBy({ id: userId });
  }

  async remove(userId: number, id: number) {
    if (userId !== id) {
      throw new ForbiddenException('Нельзя удалить чужой профиль');
    } else {
      return await this.userRepository.delete(id);
    }
  }
}
