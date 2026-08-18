import { ApiProperty } from '@nestjs/swagger';
import { SavedListingEntity } from '../persistence/saved-listings/saved-listing.entity';
import { ListingResponse } from '../../listings/usecase/listing.response';

export class SavedListingResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  listingId: string;

  @ApiProperty({ type: () => ListingResponse })
  listing: ListingResponse;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: SavedListingEntity): SavedListingResponse {
    const response = new SavedListingResponse();

    response.id = entity.id;
    response.listingId = entity.listingId;
    response.createdAt = entity.createdAt;

    if (entity.listing) {
      response.listing = ListingResponse.fromEntity(entity.listing);
    }

    return response;
  }
}
