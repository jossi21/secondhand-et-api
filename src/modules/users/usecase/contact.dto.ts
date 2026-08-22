import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ContactType } from '../persistence/users/user-role.enum';

export class ContactDto {
  @IsEnum(ContactType)
  type: ContactType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value: string;
}
