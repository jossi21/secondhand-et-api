import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { SavedListingRepository } from '../persistence/saved-listings/saved-listing.repository';
import { SavedListingResponse } from './saved-listing.response';

@Injectable()
export class SavedListingQuery {
  constructor(
    private readonly savedListingRepository: SavedListingRepository,
  ) {}

  async getMySavedListings(
    currentUser: UserEntity,
  ): Promise<SavedListingResponse[]> {
    const saved = await this.savedListingRepository.getByUser(currentUser.id);
    return saved.map((s) => SavedListingResponse.fromEntity(s));
  }
}
