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

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: ListingEntity): ListingResponse {
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
