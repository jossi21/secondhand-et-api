import { ApiProperty } from '@nestjs/swagger';
import {
  ListingEntity,
  Condition,
  ListingStatus,
} from '../persistence/listings/listing.entity';

export class ListingImageResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  sortOrder: number;
}

export class ListingSellerInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  averageRating: number;

  @ApiProperty({ type: () => [Object], required: false })
  contacts?: { type: string; value: string }[];
}

export class ListingResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: Condition })
  condition: Condition;

  @ApiProperty({ enum: ListingStatus })
  status: ListingStatus;

  @ApiProperty()
  city: string;

  @ApiProperty({ required: false })
  neighborhood?: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty({ type: () => [ListingImageResponse] })
  images: ListingImageResponse[];

  @ApiProperty({ type: () => ListingSellerInfo, required: false })
  seller?: ListingSellerInfo;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(
    entity: ListingEntity,
    sellerRating?: number,
  ): ListingResponse {
    const response = new ListingResponse();

    response.id = entity.id;
    response.title = entity.title;
    response.description = entity.description;
    response.price = Number(entity.price);
    response.condition = entity.condition;
    response.status = entity.status;
    response.city = entity.city;
    response.neighborhood = entity.neighborhood;
    response.viewCount = entity.viewCount;
    response.sellerId = entity.sellerId;
    response.categoryId = entity.categoryId;
    response.createdAt = entity.createdAt;
    response.images = (entity.images ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({ id: img.id, url: img.url, sortOrder: img.sortOrder }));

    if (entity.seller) {
      response.seller = {
        id: entity.seller.id,
        fullName: entity.seller.fullName,
        isVerified: entity.seller.isVerified,
        averageRating: sellerRating ?? 0,
        contacts: entity.seller.contacts,
      };
    }

    return response;
  }
}

export class PaginatedListingResponse {
  @ApiProperty({ type: () => [ListingResponse] })
  data: ListingResponse[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
