import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { UserEntity } from '../../users/persistence/users/user.entity';
import {
  SavedListingCommands,
  ToggleSavedListingResult,
} from '../usecase/saved-listing.logic.commands';
import { SavedListingQuery } from '../usecase/saved-listing.logic.query';
import { SavedListingResponse } from '../usecase/saved-listing.response';

@ApiTags('saved-listings')
@ApiBearerAuth()
@Controller('saved-listings')
export class SavedListingController {
  constructor(
    private readonly savedListingCommands: SavedListingCommands,
    private readonly savedListingQuery: SavedListingQuery,
  ) {}

  @Get()
  async getMySavedListings(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SavedListingResponse[]> {
    return this.savedListingQuery.getMySavedListings(currentUser);
  }

  @Put(':listingId')
  async toggleSavedListing(
    @Param('listingId') listingId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ToggleSavedListingResult> {
    return this.savedListingCommands.toggleSavedListing(listingId, currentUser);
  }
}
