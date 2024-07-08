import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWish(createWishDto: CreateWishDto, id: number) {
    const wish = {
      ...createWishDto,
      owner: { id },
    };

    return await this.wishRepository.save(wish);
  }

  async findAll() {
    return await this.wishRepository.find();
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new NotFoundException('Не удалось найти подарок по переданному id');
    }
    return wish;
  }

  async findLast() {
    return await this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTop() {
    return await this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    return await this.wishRepository.update(id, updateWishDto);
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    console.log(wish.owner.id, wish);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скопировать свой же подарок');
    }

    const copyWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      copied: wish.copied + 1,
    };

    const copyWish = await this.createWish(copyWishDto, user.id);

    return `Подарок ${copyWish.name} скопирован в ваш вишлист`;
  }

  async removeWish(id: number, userId: number) {
    const wish = await this.findOne(id);

    if (wish?.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }
    await this.wishRepository.delete(id);
    return wish;
  }
}
