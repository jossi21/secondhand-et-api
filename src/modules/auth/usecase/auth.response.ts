import { ApiProperty } from '@nestjs/swagger';
import {
  UserEntity,
  UserContact,
} from '../../users/persistence/users/user.entity';
import { UserRole } from '../../users/persistence/users/user-role.enum';

export class UserInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ required: false })
  nationalIdRef?: string;

  @ApiProperty({ required: false })
  nationalIdPhotoUrl?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ required: false, description: 'Seller contact methods' })
  contacts?: UserContact[];

  static fromEntity(entity: UserEntity): UserInfo {
    const info = new UserInfo();

    info.id = entity.id;
    info.fullName = entity.fullName;
    info.email = entity.email;
    info.phone = entity.phone;
    info.city = entity.city;
    info.isVerified = entity.isVerified;
    info.nationalIdRef = entity.nationalIdRef;
    info.nationalIdPhotoUrl = entity.nationalIdPhotoUrl;
    info.role = entity.role;
    info.contacts = entity.contacts;

    return info;
  }
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: () => UserInfo })
  user: UserInfo;

  static build(accessToken: string, entity: UserEntity): AuthResponse {
    const response = new AuthResponse();

    response.accessToken = accessToken;
    response.user = UserInfo.fromEntity(entity);

    return response;
  }
}
