import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../persistence/users/user.repository';
import { UpdateUserCommand } from './user.commands';
import { UserResponse } from './user.response';

@Injectable()
export class UserCommands {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUser(
    id: string,
    command: UpdateUserCommand,
  ): Promise<UserResponse> {
    const existing = await this.userRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`User not found with id ${id}`);
    }

    const updated = await this.userRepository.updateUser(id, {
      fullName: command.fullName ?? existing.fullName,
      phone: command.phone ?? existing.phone,
      city: command.city ?? existing.city,
      isVerified: command.isVerified ?? existing.isVerified,
    });

    return UserResponse.fromEntity(updated);
  }

  async archiveUser(id: string): Promise<void> {
    const existing = await this.userRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`User not found with id ${id}`);
    }

    await this.userRepository.archiveUser(id);
  }

  async restoreUser(id: string): Promise<void> {
    await this.userRepository.restoreUser(id);
  }
}
