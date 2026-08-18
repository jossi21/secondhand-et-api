import { ApiProperty } from '@nestjs/swagger';
import { RatingEntity } from '../persistence/ratings/rating.entity';

export class RatingResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ required: false })
  comment?: string;

  @ApiProperty()
  fromUserId: string;

  @ApiProperty({ required: false })
  fromUserName?: string;

  @ApiProperty()
  toUserId: string;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: RatingEntity): RatingResponse {
    const response = new RatingResponse();

    response.id = entity.id;
    response.score = entity.score;
    response.comment = entity.comment;
    response.fromUserId = entity.fromUserId;
    response.toUserId = entity.toUserId;
    response.createdAt = entity.createdAt;

    if (entity.fromUser) {
      response.fromUserName = entity.fromUser.fullName;
    }

    return response;
  }
}

export class SellerRatingSummary {
  @ApiProperty()
  average: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ type: () => [RatingResponse] })
  ratings: RatingResponse[];
}
