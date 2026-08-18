import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { RatingEntity } from './persistence/ratings/rating.entity';
import { RatingRepository } from './persistence/ratings/rating.repository';
import { RatingController } from './controller/rating.controller';
import { RatingCommands } from './usecase/rating.logic.commands';
import { RatingQuery } from './usecase/rating.logic.query';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity]), UsersModule],
  controllers: [RatingController],
  providers: [RatingRepository, RatingCommands, RatingQuery],
})
export class RatingsModule {}
