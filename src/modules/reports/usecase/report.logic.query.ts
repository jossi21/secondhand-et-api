import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../persistence/reports/report.repository';
import { ReportResponse } from './report.response';

@Injectable()
export class ReportQuery {
  constructor(private readonly reportRepository: ReportRepository) {}

  async getAllReports(): Promise<ReportResponse[]> {
    const reports = await this.reportRepository.getAll();
    return reports.map((r) => ReportResponse.fromEntity(r));
  }

  async getReportsForListing(listingId: string): Promise<ReportResponse[]> {
    const reports = await this.reportRepository.getForListing(listingId);
    return reports.map((r) => ReportResponse.fromEntity(r));
  }
}
