import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { Public } from '../../../libs/common/decorators/public.decorator';
import { UserEntity } from '../../users/persistence/users/user.entity';
import {
  CreateRatingCommand,
  UpdateRatingCommand,
} from '../usecase/rating.commands';
import { RatingCommands } from '../usecase/rating.logic.commands';
import { RatingQuery } from '../usecase/rating.logic.query';
import {
  RatingResponse,
  SellerRatingSummary,
} from '../usecase/rating.response';

@ApiTags('ratings')
@Controller('ratings')
export class RatingController {
  constructor(
    private readonly ratingCommands: RatingCommands,
    private readonly ratingQuery: RatingQuery,
  ) {}

  @Public()
  @Get('seller/:sellerId')
  async getSellerRatings(
    @Param('sellerId') sellerId: string,
  ): Promise<SellerRatingSummary> {
    return this.ratingQuery.getSellerRatings(sellerId);
  }

  @ApiBearerAuth()
  @Post()
  async createRating(
    @Body() command: CreateRatingCommand,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<RatingResponse> {
    return this.ratingCommands.createRating(command, currentUser);
  }

  @ApiBearerAuth()
  @Patch(':id')
  async updateRating(
    @Param('id') id: string,
    @Body() command: UpdateRatingCommand,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<RatingResponse> {
    return this.ratingCommands.updateRating(id, command, currentUser);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteRating(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    return this.ratingCommands.deleteRating(id, currentUser);
  }
}
