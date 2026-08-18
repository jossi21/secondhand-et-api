import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ListingRepository,
  ListingFilters,
} from '../persistence/listings/listing.repository';
import { ListingResponse, PaginatedListingResponse } from './listing.response';

@Injectable()
export class ListingQuery {
  constructor(private readonly listingRepository: ListingRepository) {}

  async getListing(id: string): Promise<ListingResponse> {
    const listing = await this.listingRepository.getById(id);
    if (!listing) {
      throw new NotFoundException(`Listing not found with id ${id}`);
    }

    await this.listingRepository.incrementViewCount(id);

    return ListingResponse.fromEntity(listing);
  }

  async searchListings(
    filters: ListingFilters,
  ): Promise<PaginatedListingResponse> {
    const { data, total } = await this.listingRepository.search(filters);

    const response = new PaginatedListingResponse();
    response.data = data.map((listing) => ListingResponse.fromEntity(listing));
    response.total = total;
    response.page = filters.page && filters.page > 0 ? filters.page : 1;
    response.limit = filters.limit && filters.limit > 0 ? filters.limit : 20;

    return response;
  }
}
