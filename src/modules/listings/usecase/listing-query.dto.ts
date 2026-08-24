import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ListingStatus } from '../persistence/listings/listing.entity';

export class ListingQueryDto {
  @ApiPropertyOptional({ description: 'Search text in title/description' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  maxPrice?: number;

  @ApiPropertyOptional({
    enum: [...Object.values(ListingStatus), 'all'],
    description:
      'Filter by status. Omit to default to active (public browse). Pass "all" (admin only, in practice) to see every status.',
  })
  @IsOptional()
  @IsIn([...Object.values(ListingStatus), 'all'])
  status?: ListingStatus | 'all';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  sellerId?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
