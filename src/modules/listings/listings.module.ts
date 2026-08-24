import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '../categories/categories.module';
import { RatingsModule } from '../ratings/rating.module';
import { ListingEntity } from './persistence/listings/listing.entity';
import { ListingImageEntity } from './persistence/listings/listing-image.entity';
import { ListingRepository } from './persistence/listings/listing.repository';
import { ListingController } from './controller/listing.controller';
import { ListingCommands } from './usecase/listing.logic.commands';
import { ListingQuery } from './usecase/listing.logic.query';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListingEntity, ListingImageEntity]),
    CategoriesModule,
    forwardRef(() => RatingsModule),
  ],
  controllers: [ListingController],
  providers: [ListingRepository, ListingCommands, ListingQuery],
  exports: [ListingRepository],
})
export class ListingsModule {}
