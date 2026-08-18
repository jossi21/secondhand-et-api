import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from '../listings/listings.module';
import { ReportEntity } from './persistence/reports/report.entity';
import { ReportRepository } from './persistence/reports/report.repository';
import { ReportController } from './controller/report.controller';
import { ReportCommands } from './usecase/report.logic.commands';
import { ReportQuery } from './usecase/report.logic.query';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), ListingsModule],
  controllers: [ReportController],
  providers: [ReportRepository, ReportCommands, ReportQuery],
})
export class ReportsModule {}
