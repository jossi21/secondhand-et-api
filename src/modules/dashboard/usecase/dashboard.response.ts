import { ApiProperty } from '@nestjs/swagger';
import { ListingResponse } from '../../listings/usecase/listing.response';
import { RatingResponse } from '../../ratings/usecase/rating.response';
import { ReportResponse } from '../../reports/usecase/report.response';
import { SavedListingResponse } from '../../saved-listings/usecase/saved-listing.response';

export class SellerDashboardResponse {
  @ApiProperty()
  activeListings: number;

  @ApiProperty()
  soldListings: number;

  @ApiProperty()
  totalViews: number;

  @ApiProperty()
  averageRating: number;

  @ApiProperty({ type: () => [ListingResponse] })
  listings: ListingResponse[];

  @ApiProperty({ type: () => [RatingResponse] })
  recentRatings: RatingResponse[];

  @ApiProperty({ type: () => [ReportResponse] })
  recentReports: ReportResponse[];
}

export class BuyerDashboardResponse {
  @ApiProperty()
  savedListingsCount: number;

  @ApiProperty()
  ratingsGivenCount: number;

  @ApiProperty()
  reportsFiledCount: number;

  @ApiProperty({ type: () => [SavedListingResponse] })
  savedListings: SavedListingResponse[];

  @ApiProperty({ type: () => [RatingResponse] })
  ratingsGiven: RatingResponse[];
}

export class PublicStatsResponse {
  activeListings: number;
  soldListings: number;
  citiesCovered: number;
  verifiedSellers: number;
}
