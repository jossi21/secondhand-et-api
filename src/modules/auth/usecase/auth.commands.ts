import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import { ContactDto } from '../../users/usecase/contact.dto';

export class RegisterCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    description: 'Required for buyers only. Sellers use `contacts` instead.',
  })
  @ValidateIf((o: RegisterCommand) => o.role === UserRole.BUYER)
  @IsNotEmpty({ message: 'Phone is required for buyers' })
  @IsString()
  phone?: string;

  @ApiProperty({
    type: () => [ContactDto],
    required: false,
    description:
      'Required for sellers only (min 1, max 5). One contact may be of type "phone" — that value is also stored as the account phone number.',
  })
  @ValidateIf((o: RegisterCommand) => o.role === UserRole.SELLER)
  @ArrayMinSize(1, { message: 'Seller must select at least one contact' })
  @ArrayMaxSize(5)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts?: ContactDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ enum: [UserRole.BUYER, UserRole.SELLER] })
  @IsNotEmpty()
  @IsIn([UserRole.BUYER, UserRole.SELLER])
  role: UserRole;
}

export class LoginCommand {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
