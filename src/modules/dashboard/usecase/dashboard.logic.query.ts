import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { ListingRepository } from '../../listings/persistence/listings/listing.repository';
import { ListingResponse } from '../../listings/usecase/listing.response';
import { RatingRepository } from '../../ratings/persistence/ratings/rating.repository';
import { RatingResponse } from '../../ratings/usecase/rating.response';
import { ReportRepository } from '../../reports/persistence/reports/report.repository';
import { ReportResponse } from '../../reports/usecase/report.response';
import { SavedListingRepository } from '../../saved-listings/persistence/saved-listings/saved-listing.repository';
import { SavedListingResponse } from '../../saved-listings/usecase/saved-listing.response';
import {
  BuyerDashboardResponse,
  SellerDashboardResponse,
  PublicStatsResponse,
} from './dashboard.response';
import { UserRepository } from '../../users/persistence/users/user.repository';
const RECENT_LIMIT = 5;

@Injectable()
export class DashboardQuery {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly ratingRepository: RatingRepository,
    private readonly reportRepository: ReportRepository,
    private readonly savedListingRepository: SavedListingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getSellerDashboard(
    currentUser: UserEntity,
  ): Promise<SellerDashboardResponse> {
    const [stats, listings, ratings, reports] = await Promise.all([
      this.listingRepository.getSellerStats(currentUser.id),
      this.listingRepository.getBySeller(currentUser.id),
      this.ratingRepository.getForSeller(currentUser.id),
      this.reportRepository.getForSeller(currentUser.id),
    ]);

    const { average } = await this.ratingRepository.getAverageForSeller(
      currentUser.id,
    );

    const response = new SellerDashboardResponse();
    response.activeListings = stats.active;
    response.soldListings = stats.sold;
    response.totalViews = stats.totalViews;
    response.averageRating = Math.round(average * 10) / 10;
    response.listings = listings.map((l) => ListingResponse.fromEntity(l));
    response.recentRatings = ratings
      .slice(0, RECENT_LIMIT)
      .map((r) => RatingResponse.fromEntity(r));
    response.recentReports = reports
      .slice(0, RECENT_LIMIT)
      .map((r) => ReportResponse.fromEntity(r));

    return response;
  }

  async getBuyerDashboard(
    currentUser: UserEntity,
  ): Promise<BuyerDashboardResponse> {
    const [savedListings, ratingsGiven, reportsFiledCount] = await Promise.all([
      this.savedListingRepository.getByUser(currentUser.id),
      this.ratingRepository.getGivenByUser(currentUser.id),
      this.reportRepository.countFiledByUser(currentUser.id),
    ]);

    const response = new BuyerDashboardResponse();
    response.savedListingsCount = savedListings.length;
    response.ratingsGivenCount = ratingsGiven.length;
    response.reportsFiledCount = reportsFiledCount;
    response.savedListings = savedListings.map((s) =>
      SavedListingResponse.fromEntity(s),
    );
    response.ratingsGiven = ratingsGiven.map((r) =>
      RatingResponse.fromEntity(r),
    );

    return response;
  }

  async getPublicStats(): Promise<PublicStatsResponse> {
    const [platformStats, verifiedSellers] = await Promise.all([
      this.listingRepository.getPlatformStats(),
      this.userRepository.countVerifiedSellers(),
    ]);

    const response = new PublicStatsResponse();
    response.activeListings = platformStats.activeListings;
    response.soldListings = platformStats.soldListings;
    response.citiesCovered = platformStats.citiesCovered;
    response.verifiedSellers = verifiedSellers;

    return response;
  }
}
