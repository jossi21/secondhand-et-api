import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../persistence/users/user.repository';
import { UpdateUserCommand } from './user.commands';
import { UserResponse } from './user.response';
import { ContactType, UserRole } from '../persistence/users/user-role.enum';

const MAX_SELLER_CONTACTS = 5;

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

    if (command.contacts && existing.role !== UserRole.SELLER) {
      throw new BadRequestException('Only sellers can have contact methods');
    }

    if (command.phone && existing.role === UserRole.SELLER) {
      throw new BadRequestException(
        'Sellers cannot set phone directly — update it via contacts instead',
      );
    }

    let resolvedPhone = command.phone ?? existing.phone;

    if (command.contacts) {
      if (command.contacts.length === 0) {
        throw new BadRequestException('Seller must keep at least one contact');
      }
      if (command.contacts.length > MAX_SELLER_CONTACTS) {
        throw new BadRequestException(
          `A seller can have at most ${MAX_SELLER_CONTACTS} contacts`,
        );
      }

      const phoneContact = command.contacts.find(
        (c) => c.type === ContactType.PHONE,
      );
      resolvedPhone = phoneContact?.value;
    }

    const updated = await this.userRepository.updateUser(id, {
      fullName: command.fullName ?? existing.fullName,
      phone: resolvedPhone,
      city: command.city ?? existing.city,
      isVerified: command.isVerified ?? existing.isVerified,
      contacts: command.contacts ?? existing.contacts,
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
