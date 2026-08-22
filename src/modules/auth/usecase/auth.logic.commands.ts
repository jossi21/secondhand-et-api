import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/persistence/users/user.repository';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { LoginCommand, RegisterCommand } from './auth.commands';
import { AuthResponse, UserInfo } from './auth.response';
import {
  ContactType,
  UserRole,
} from '../../users/persistence/users/user-role.enum';

const MAX_SELLER_CONTACTS = 5;

@Injectable()
export class AuthCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @param createdBy - id of the admin submitting this on behalf of a
   *   seller. Leave undefined for self-registration.
   */
  async register(
    command: RegisterCommand,
    createdBy?: string,
  ): Promise<UserInfo> {
    const existingEmail = await this.userRepository.getByEmail(command.email);
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    let resolvedPhone: string | undefined = command.phone;

    if (command.role === UserRole.SELLER) {
      if (!command.contacts || command.contacts.length === 0) {
        throw new BadRequestException(
          'Seller must select at least one contact (phone, telegram or whatsapp)',
        );
      }
      if (command.contacts.length > MAX_SELLER_CONTACTS) {
        throw new BadRequestException(
          `A seller can have at most ${MAX_SELLER_CONTACTS} contacts`,
        );
      }

      // A seller never fills the standalone `phone` field directly.
      // If they picked "phone" as one of their contact types, that
      // value doubles as the account phone number automatically.
      const phoneContact = command.contacts.find(
        (c) => c.type === ContactType.PHONE,
      );
      resolvedPhone = phoneContact?.value;
    }

    if (resolvedPhone) {
      const existingPhone = await this.userRepository.getByPhone(resolvedPhone);
      if (existingPhone) {
        throw new ConflictException('Phone number is already registered');
      }
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    const user = new UserEntity();
    user.fullName = command.fullName;
    user.email = command.email;
    user.phone = resolvedPhone;
    user.passwordHash = passwordHash;
    user.city = command.city;
    user.role = command.role;
    user.contacts =
      command.role === UserRole.SELLER ? command.contacts : undefined;

    if (createdBy) {
      user.createdBy = createdBy;
    }

    const savedUser = await this.userRepository.createUser(user);

    return UserInfo.fromEntity(savedUser);
  }

  async login(command: LoginCommand): Promise<AuthResponse> {
    const user = await this.userRepository.getByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      command.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (command.role && user.role !== command.role) {
      throw new UnauthorizedException('Invalid role for this account');
    }

    const accessToken = this.issueToken(user);

    return AuthResponse.build(accessToken, user);
  }

  private issueToken(user: UserEntity): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
