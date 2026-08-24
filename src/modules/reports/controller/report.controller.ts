import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import { CreateReportCommand } from '../usecase/report.commands';
import { ReportCommands } from '../usecase/report.logic.commands';
import { ReportQuery } from '../usecase/report.logic.query';
import { ReportResponse } from '../usecase/report.response';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportCommands: ReportCommands,
    private readonly reportQuery: ReportQuery,
  ) {}

  @Post()
  async createReport(
    @Body() command: CreateReportCommand,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ReportResponse> {
    return this.reportCommands.createReport(command, currentUser);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async getAllReports(): Promise<ReportResponse[]> {
    return this.reportQuery.getAllReports();
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get('listing/:listingId')
  async getReportsForListing(
    @Param('listingId') listingId: string,
  ): Promise<ReportResponse[]> {
    return this.reportQuery.getReportsForListing(listingId);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async dismissReport(@Param('id') id: string): Promise<void> {
    return this.reportCommands.dismissReport(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getReportById(@Param('id') id: string): Promise<ReportResponse> {
    return this.reportQuery.getReportById(id);
  }
}
