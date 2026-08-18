import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserEntity } from '../../../users/persistence/users/user.entity';
import { ListingEntity } from '../../../listings/persistence/listings/listing.entity';

@Entity('reports')
@Index(['listingId'])
export class ReportEntity extends BaseEntity {
  @Column('text')
  reason: string;

  @Column({ name: 'listing_id', type: 'uuid' })
  listingId: string;

  @ManyToOne(() => ListingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing: ListingEntity;

  @Column({ name: 'reported_by_id', type: 'uuid' })
  reportedById: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'reported_by_id' })
  reportedBy: UserEntity;
}
