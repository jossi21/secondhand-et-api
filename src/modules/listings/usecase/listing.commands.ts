import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { UserEntity } from '../../users/persistence/users/user.entity';
import {
  Condition,
  ListingEntity,
  ListingStatus,
} from '../persistence/listings/listing.entity';

export class CreateListingCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ enum: Condition })
  @IsNotEmpty()
  @IsEnum(Condition)
  condition: Condition;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ type: [String], required: false, maxItems: 8 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  imageUrls?: string[];

  static fromCommand(
    command: CreateListingCommand,
    seller: UserEntity,
  ): ListingEntity {
    const listing = new ListingEntity();

    listing.title = command.title;
    listing.description = command.description;
    listing.price = command.price;
    listing.condition = command.condition;
    listing.status = ListingStatus.ACTIVE;
    listing.city = command.city;
    listing.neighborhood = command.neighborhood;
    listing.categoryId = command.categoryId;
    listing.sellerId = seller.id;
    listing.createdBy = seller.id;

    return listing;
  }
}

export class UpdateListingCommand {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ enum: Condition, required: false })
  @IsOptional()
  @IsEnum(Condition)
  condition?: Condition;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ type: [String], required: false, maxItems: 8 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({ enum: ListingStatus, required: false })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}
