import { IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';
import { CommonEntity } from 'src/common-entity/common-entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Entity, Column, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Wish extends CommonEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsPositive()
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsNumber()
  @IsPositive()
  raised: number;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.item, {
    onDelete: 'CASCADE',
  })
  offers: Offer[];
}
