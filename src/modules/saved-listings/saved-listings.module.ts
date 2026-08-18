import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from '../listings/listings.module';
import { SavedListingEntity } from './persistence/saved-listings/saved-listing.entity';
import { SavedListingRepository } from './persistence/saved-listings/saved-listing.repository';
import { SavedListingController } from './controller/saved-listing.controller';
import { SavedListingCommands } from './usecase/saved-listing.logic.commands';
import { SavedListingQuery } from './usecase/saved-listing.logic.query';
@Module({
  imports: [TypeOrmModule.forFeature([SavedListingEntity]), ListingsModule],
  controllers: [SavedListingController],
  providers: [SavedListingRepository, SavedListingCommands, SavedListingQuery],
})
export class SavedListingsModule {}
