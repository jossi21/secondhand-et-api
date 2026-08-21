import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './modules/users/persistence/users/user.entity';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './libs/common/guards/jwt-auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryEntity } from './modules/categories/persistence/categories/category.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { ListingEntity } from './modules/listings/persistence/listings/listing.entity';
import { ListingImageEntity } from './modules/listings/persistence/listings/listing-image.entity';
import { ListingsModule } from './modules/listings/listings.module';
import { SavedListingEntity } from './modules/saved-listings/persistence/saved-listings/saved-listing.entity';
import { SavedListingsModule } from './modules/saved-listings/saved-listings.module';
import { RatingEntity } from './modules/ratings/persistence/ratings/rating.entity';
import { RatingsModule } from './modules/ratings/rating.module';
import { ReportEntity } from './modules/reports/persistence/reports/report.entity';
import { ReportsModule } from './modules/reports/reports.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UploadsModule } from './modules/uploads/uploads.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          UserEntity,
          CategoryEntity,
          ListingEntity,
          ListingImageEntity,
          SavedListingEntity,
          RatingEntity,
          ReportEntity,
        ],
        synchronize: false,
        logging: false,
      }),
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ListingsModule,
    SavedListingsModule,
    RatingsModule,
    ReportsModule,
    DashboardModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
