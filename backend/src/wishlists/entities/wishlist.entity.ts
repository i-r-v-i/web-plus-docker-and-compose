import { IsString, IsUrl, Length } from 'class-validator';
import { CommonEntity } from 'src/common-entity/common-entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Wishlist extends CommonEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Wish[];
}
