import { Module } from '@nestjs/common';
import { ListingsModule } from '../listings/listings.module';
import { RatingsModule } from '../ratings/rating.module'; // check exact name/casing
import { ReportsModule } from '../reports/reports.module';
import { SavedListingsModule } from '../saved-listings/saved-listings.module';
import { UsersModule } from '../users/users.module';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardQuery } from './usecase/dashboard.logic.query';

@Module({
  imports: [
    ListingsModule,
    RatingsModule,
    ReportsModule,
    SavedListingsModule,
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardQuery],
})
export class DashboardModule {}
