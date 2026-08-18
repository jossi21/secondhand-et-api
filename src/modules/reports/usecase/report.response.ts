import { ApiProperty } from '@nestjs/swagger';
import { ReportEntity } from '../persistence/reports/report.entity';

export class ReportResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  listingId: string;

  @ApiProperty({ required: false })
  listingTitle?: string;

  @ApiProperty()
  reportedById: string;

  @ApiProperty({ required: false })
  reportedByName?: string;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: ReportEntity): ReportResponse {
    const response = new ReportResponse();

    response.id = entity.id;
    response.reason = entity.reason;
    response.listingId = entity.listingId;
    response.reportedById = entity.reportedById;
    response.createdAt = entity.createdAt;

    if (entity.listing) {
      response.listingTitle = entity.listing.title;
    }
    if (entity.reportedBy) {
      response.reportedByName = entity.reportedBy.fullName;
    }

    return response;
  }
}
