import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { Public } from '../../../libs/common/decorators/public.decorator';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { LoginCommand, RegisterCommand } from '../usecase/auth.commands';
import { AuthCommands } from '../usecase/auth.logic.commands';
import { AuthResponse, UserInfo } from '../usecase/auth.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authCommands: AuthCommands) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already in use' })
  async register(@Body() command: RegisterCommand): Promise<UserInfo> {
    return this.authCommands.register(command);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() command: LoginCommand): Promise<AuthResponse> {
    return this.authCommands.login(command);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  me(@CurrentUser() currentUser: UserEntity): { user: UserInfo } {
    return { user: UserInfo.fromEntity(currentUser) };
  }
}
