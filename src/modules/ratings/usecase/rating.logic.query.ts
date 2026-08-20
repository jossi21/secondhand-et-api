import { Injectable } from '@nestjs/common';
import { RatingRepository } from '../persistence/ratings/rating.repository';
import { RatingResponse, SellerRatingSummary } from './rating.response';

@Injectable()
export class RatingQuery {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async getSellerRatings(sellerId: string): Promise<SellerRatingSummary> {
    const [ratings, { average, count }] = await Promise.all([
      this.ratingRepository.getForSeller(sellerId),
      this.ratingRepository.getAverageForSeller(sellerId),
    ]);

    const summary = new SellerRatingSummary();
    summary.average = Math.round(average * 10) / 10;
    summary.count = count;
    summary.ratings = ratings.map((r) => RatingResponse.fromEntity(r));

    return summary;
  }

  async getAllRatings(): Promise<RatingResponse[]> {
    const ratings = await this.ratingRepository.getAll();
    return ratings.map((r) => RatingResponse.fromEntity(r));
  }
}
