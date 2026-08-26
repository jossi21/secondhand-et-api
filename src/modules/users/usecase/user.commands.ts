import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContactDto } from './contact.dto';

export class SubmitNationalIdCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationalIdRef: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationalIdPhotoUrl: string;
}

export class UpdateUserCommand {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    required: false,
    description:
      'Buyers only. Sellers should update `contacts` instead — phone is derived from it.',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    type: () => [ContactDto],
    required: false,
    description:
      'Sellers only. Full replacement list of contacts (max 5). If one entry has type "phone", it also replaces the account phone number.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];
}
