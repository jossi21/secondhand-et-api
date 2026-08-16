import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { ListingEntity } from './listing.entity';

@Entity('listing_images')
export class ListingImageEntity extends BaseEntity {
  @Column()
  url: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string;

  @ManyToOne(() => ListingEntity, (listing) => listing.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'listing_id' })
  listing: ListingEntity;
}
