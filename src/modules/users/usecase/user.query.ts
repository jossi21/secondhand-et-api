import { Injectable } from '@nestjs/common';
import { UserRepository } from '../persistence/users/user.repository';
import { UserRole } from '../persistence/users/user-role.enum';
import { UserResponse } from './user.response';

@Injectable()
export class UserQuery {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(role?: UserRole): Promise<UserResponse[]> {
    const users = role
      ? await this.userRepository.find({
          where: { role },
          order: { createdAt: 'DESC' },
        })
      : await this.userRepository.find({ order: { createdAt: 'DESC' } });

    return users.map((u) => UserResponse.fromEntity(u));
  }
}
