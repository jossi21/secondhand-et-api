import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SavedListingEntity } from './saved-listing.entity';

@Injectable()
export class SavedListingRepository extends Repository<SavedListingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SavedListingEntity, dataSource.createEntityManager());
  }

  async findByUserAndListing(
    userId: string,
    listingId: string,
  ): Promise<SavedListingEntity | null> {
    return this.findOne({ where: { userId, listingId } });
  }

  async getByUser(userId: string): Promise<SavedListingEntity[]> {
    return this.find({
      where: { userId },
      relations: ['listing', 'listing.images', 'listing.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async saveListing(entity: SavedListingEntity): Promise<SavedListingEntity> {
    return this.save(entity);
  }
}
