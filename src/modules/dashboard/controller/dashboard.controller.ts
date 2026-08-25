import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { DashboardQuery } from '../usecase/dashboard.logic.query';
import {
  BuyerDashboardResponse,
  SellerDashboardResponse,
  PublicStatsResponse,
} from '../usecase/dashboard.response';
import { Public } from '../../../libs/common/decorators/public.decorator';
@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardQuery: DashboardQuery) {}

  @Get('seller')
  async getSellerDashboard(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SellerDashboardResponse> {
    return this.dashboardQuery.getSellerDashboard(currentUser);
  }

  @Get('buyer')
  async getBuyerDashboard(
    @CurrentUser() currentUser: UserEntity,
  ): Promise<BuyerDashboardResponse> {
    return this.dashboardQuery.getBuyerDashboard(currentUser);
  }

  @Public()
  @Get('public-stats')
  async getPublicStats(): Promise<PublicStatsResponse> {
    return this.dashboardQuery.getPublicStats();
  }
}
