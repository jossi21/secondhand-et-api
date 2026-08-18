import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReportCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reason: string;
}
