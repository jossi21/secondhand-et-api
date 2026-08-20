import {
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

@Injectable()
export class AuthCommands {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(command: RegisterCommand): Promise<UserInfo> {
    const existingEmail = await this.userRepository.getByEmail(command.email);
    if (existingEmail) {
      throw new ConflictException('Email is already registered');
    }

    const existingPhone = await this.userRepository.getByPhone(command.phone);
    if (existingPhone) {
      throw new ConflictException('Phone number is already registered');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    const user = new UserEntity();
    user.fullName = command.fullName;
    user.email = command.email;
    user.phone = command.phone;
    user.passwordHash = passwordHash;
    user.city = command.city;
    user.role = command.role;

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
