import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../../libs/common/decorators/public.decorator';
import { LoginCommand, RegisterCommand } from '../usecase/auth.commands';
import { AuthCommands } from '../usecase/auth.logic.commands';
import { AuthResponse, UserInfo } from '../usecase/auth.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authCommands: AuthCommands) {}

  @Public()
  @Post('login')
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() command: LoginCommand): Promise<AuthResponse> {
    return this.authCommands.login(command);
  }

  @Public()
  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email or phone already in use' })
  async register(@Body() command: RegisterCommand): Promise<UserInfo> {
    return this.authCommands.register(command);
  }
}
