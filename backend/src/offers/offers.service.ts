import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: {
        offers: true,
        owner: true,
      },
    });
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скидываться на свой подарок');
    }

    if (wish.raised > wish.price) {
      throw new BadRequestException(
        `Сумма собранных средств не может превышать стоимость подарка, Вы можете добавить только недостающую сумму - ${wish.price - wish.raised}`,
      );
    }

    await this.wishRepository.increment(
      { id: wish.id },
      'raised',
      createOfferDto.amount,
    );

    return await this.offerRepository.save({
      ...createOfferDto,
      item: wish,
      user,
    });
  }

  async findAll() {
    return await this.offerRepository.find({
      relations: { user: true, item: true },
    });
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });

    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }

    return offer;
  }
}
