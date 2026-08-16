import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserEntity } from '../../../users/persistence/users/user.entity';
import { CategoryEntity } from '../../../categories/persistence/categories/category.entity';
import { ListingImageEntity } from './listing-image.entity';

export enum Condition {
  BRAND_NEW = 'brand_new',
  LIGHTLY_USED = 'lightly_used',
  FAIR_CONDITION = 'fair_condition',
}

export enum ListingStatus {
  ACTIVE = 'active',
  SOLD = 'sold',
  REMOVED = 'removed',
}

@Entity('listings')
@Index(['categoryId', 'status'])
@Index(['city'])
export class ListingEntity extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: Condition })
  condition: Condition;

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status: ListingStatus;

  @Column()
  city: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'seller_id' })
  seller: UserEntity;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => ListingImageEntity, (image) => image.listing, {
    cascade: true,
  })
  images: ListingImageEntity[];
}
