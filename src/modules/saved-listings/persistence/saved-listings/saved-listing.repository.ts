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

  async findByUserAndListingIncludingDeleted(
    userId: string,
    listingId: string,
  ): Promise<SavedListingEntity | null> {
    return this.findOne({
      where: { userId, listingId },
      withDeleted: true,
    });
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

  async restoreSavedListing(id: string): Promise<SavedListingEntity> {
    await this.restore(id);
    return this.findOne({ where: { id } }) as Promise<SavedListingEntity>;
  }
}
