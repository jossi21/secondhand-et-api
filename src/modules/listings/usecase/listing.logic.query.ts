import { Injectable, NotFoundException } from '@nestjs/common';
import { RatingRepository } from '../../ratings/persistence/ratings/rating.repository';
import {
  ListingRepository,
  ListingFilters,
} from '../persistence/listings/listing.repository';
import { ListingResponse, PaginatedListingResponse } from './listing.response';

@Injectable()
export class ListingQuery {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly ratingRepository: RatingRepository,
  ) {}

  async getListing(id: string): Promise<ListingResponse> {
    const listing = await this.listingRepository.getById(id);
    if (!listing) {
      throw new NotFoundException(`Listing not found with id ${id}`);
    }

    await this.listingRepository.incrementViewCount(id);

    const { average } = await this.ratingRepository.getAverageForSeller(
      listing.sellerId,
    );

    return ListingResponse.fromEntity(listing, average);
  }

  async searchListings(
    filters: ListingFilters,
  ): Promise<PaginatedListingResponse> {
    const { data, total } = await this.listingRepository.search(filters);

    const sellerIds = [...new Set(data.map((l) => l.sellerId))];
    const ratingsBySeller = new Map<string, number>();
    await Promise.all(
      sellerIds.map(async (sellerId) => {
        const { average } =
          await this.ratingRepository.getAverageForSeller(sellerId);
        ratingsBySeller.set(sellerId, average);
      }),
    );

    const response = new PaginatedListingResponse();
    response.data = data.map((listing) =>
      ListingResponse.fromEntity(
        listing,
        ratingsBySeller.get(listing.sellerId),
      ),
    );
    response.total = total;
    response.page = filters.page && filters.page > 0 ? filters.page : 1;
    response.limit = filters.limit && filters.limit > 0 ? filters.limit : 20;

    return response;
  }
}
