import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './report.entity';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ReportEntity, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<ReportEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['listing', 'reportedBy'],
    });
  }

  async getAll(): Promise<ReportEntity[]> {
    return this.find({
      relations: ['listing', 'reportedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getForListing(listingId: string): Promise<ReportEntity[]> {
    return this.find({
      where: { listingId },
      relations: ['reportedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async createReport(entity: ReportEntity): Promise<ReportEntity> {
    return this.save(entity);
  }

  async getForSeller(sellerId: string): Promise<ReportEntity[]> {
    return this.createQueryBuilder('report')
      .leftJoinAndSelect('report.listing', 'listing')
      .leftJoinAndSelect('report.reportedBy', 'reportedBy')
      .where('listing.sellerId = :sellerId', { sellerId })
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async countFiledByUser(reportedById: string): Promise<number> {
    return this.count({ where: { reportedById } });
  }
}
