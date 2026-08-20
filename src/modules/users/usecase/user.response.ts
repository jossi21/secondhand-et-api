import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../persistence/users/user.entity';
import { UserRole } from '../persistence/users/user-role.enum';

export class UserResponse {
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

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: UserEntity): UserResponse {
    const response = new UserResponse();

    response.id = entity.id;
    response.fullName = entity.fullName;
    response.email = entity.email;
    response.phone = entity.phone;
    response.city = entity.city;
    response.isVerified = entity.isVerified;
    response.role = entity.role;
    response.createdAt = entity.createdAt;

    return response;
  }
}
