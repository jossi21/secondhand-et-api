import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/persistence/users/user.entity';

export class UserInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty()
  isVerified: boolean;

  static fromEntity(entity: UserEntity): UserInfo {
    const info = new UserInfo();

    info.id = entity.id;
    info.fullName = entity.fullName;
    info.email = entity.email;
    info.phone = entity.phone;
    info.city = entity.city;
    info.isVerified = entity.isVerified;

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
