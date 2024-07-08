import { IsBoolean, IsInt } from 'class-validator';
import { CommonEntity } from 'src/common-entity/common-entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends CommonEntity {
  @Column({ type: 'decimal', scale: 2, default: 0 })
  @IsInt()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
