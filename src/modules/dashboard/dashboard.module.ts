import { Module } from '@nestjs/common';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardQuery } from './usecase/dashboard.logic.query';
import { ListingsModule } from '../listings/listings.module';
import { RatingsModule } from '../ratings/rating.module';
import { ReportsModule } from '../reports/reports.module';
import { SavedListingsModule } from '../saved-listings/saved-listings.module';

@Module({
  imports: [ListingsModule, RatingsModule, ReportsModule, SavedListingsModule],
  controllers: [DashboardController],
  providers: [DashboardQuery],
})
export class DashboardModule {}
