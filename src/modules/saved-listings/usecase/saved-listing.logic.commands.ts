import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { ListingRepository } from '../../listings/persistence/listings/listing.repository';
import { SavedListingRepository } from '../persistence/saved-listings/saved-listing.repository';
import { SavedListingEntity } from '../persistence/saved-listings/saved-listing.entity';

export interface ToggleSavedListingResult {
  saved: boolean;
}

@Injectable()
export class SavedListingCommands {
  constructor(
    private readonly savedListingRepository: SavedListingRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  /**
   * Idempotent toggle: looks at the current DB state (including
   * soft-deleted rows) and flips it, rather than trusting a
   * save/unsave intent sent from the client. Avoids race conditions
   * where a fast unsave arrives before a save has been persisted.
   */
  async toggleSavedListing(
    listingId: string,
    currentUser: UserEntity,
  ): Promise<ToggleSavedListingResult> {
    const listing = await this.listingRepository.getById(listingId);
    if (!listing) {
      throw new NotFoundException(`Listing not found with id ${listingId}`);
    }

    const existing =
      await this.savedListingRepository.findByUserAndListingIncludingDeleted(
        currentUser.id,
        listingId,
      );

    if (existing && !existing.deletedAt) {
      await this.savedListingRepository.softDelete(existing.id);
      return { saved: false };
    }

    if (existing && existing.deletedAt) {
      await this.savedListingRepository.restoreSavedListing(existing.id);
      return { saved: true };
    }

    const savedListing = new SavedListingEntity();
    savedListing.userId = currentUser.id;
    savedListing.listingId = listingId;
    savedListing.createdBy = currentUser.id;
    await this.savedListingRepository.saveListing(savedListing);
    return { saved: true };
  }
}
