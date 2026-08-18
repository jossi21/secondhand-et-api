import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { ListingRepository } from '../../listings/persistence/listings/listing.repository';
import { SavedListingRepository } from '../persistence/saved-listings/saved-listing.repository';
import { SavedListingEntity } from '../persistence/saved-listings/saved-listing.entity';
import { SavedListingResponse } from './saved-listing.response';

@Injectable()
export class SavedListingCommands {
  constructor(
    private readonly savedListingRepository: SavedListingRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async saveListing(
    listingId: string,
    currentUser: UserEntity,
  ): Promise<SavedListingResponse> {
    const listing = await this.listingRepository.getById(listingId);
    if (!listing) {
      throw new NotFoundException(`Listing not found with id ${listingId}`);
    }

    const existing = await this.savedListingRepository.findByUserAndListing(
      currentUser.id,
      listingId,
    );
    if (existing) {
      throw new ConflictException('Listing already saved');
    }

    const savedListing = new SavedListingEntity();
    savedListing.userId = currentUser.id;
    savedListing.listingId = listingId;
    savedListing.createdBy = currentUser.id;

    const saved = await this.savedListingRepository.saveListing(savedListing);
    saved.listing = listing;

    return SavedListingResponse.fromEntity(saved);
  }

  async unsaveListing(
    listingId: string,
    currentUser: UserEntity,
  ): Promise<void> {
    const existing = await this.savedListingRepository.findByUserAndListing(
      currentUser.id,
      listingId,
    );
    if (!existing) {
      throw new NotFoundException('This listing is not in your saved list');
    }

    await this.savedListingRepository.softDelete(existing.id);
  }
}
