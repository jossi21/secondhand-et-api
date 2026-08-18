import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { ListingRepository } from '../../listings/persistence/listings/listing.repository';
import { ReportRepository } from '../persistence/reports/report.repository';
import { ReportEntity } from '../persistence/reports/report.entity';
import { CreateReportCommand } from './report.commands';
import { ReportResponse } from './report.response';

@Injectable()
export class ReportCommands {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async createReport(
    command: CreateReportCommand,
    currentUser: UserEntity,
  ): Promise<ReportResponse> {
    const listing = await this.listingRepository.getById(command.listingId);
    if (!listing) {
      throw new NotFoundException(
        `Listing not found with id ${command.listingId}`,
      );
    }

    const report = new ReportEntity();
    report.listingId = command.listingId;
    report.reason = command.reason;
    report.reportedById = currentUser.id;
    report.createdBy = currentUser.id;

    const saved = await this.reportRepository.createReport(report);
    saved.listing = listing;
    saved.reportedBy = currentUser;

    return ReportResponse.fromEntity(saved);
  }
}
