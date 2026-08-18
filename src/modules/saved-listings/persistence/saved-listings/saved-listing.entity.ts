import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserEntity } from '../../../users/persistence/users/user.entity';
import { ListingEntity } from '../../../listings/persistence/listings/listing.entity';

@Entity('saved_listings')
@Unique(['userId', 'listingId'])
@Index(['userId'])
export class SavedListingEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string;

  @ManyToOne(() => ListingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: ListingEntity;
}
