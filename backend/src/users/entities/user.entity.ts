import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { CommonEntity } from 'src/common-entity/common-entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, {
    onDelete: 'CASCADE',
  })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, {
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
