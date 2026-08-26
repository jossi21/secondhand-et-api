import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserEntity } from '../persistence/users/user.entity';
import { UserRole } from '../persistence/users/user-role.enum';
import {
  SubmitNationalIdCommand,
  UpdateUserCommand,
} from '../usecase/user.commands';
import { UserCommands } from '../usecase/user.logic.commands';
import { UserQuery } from '../usecase/user.query';
import { UserResponse } from '../usecase/user.response';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userQuery: UserQuery,
    private readonly userCommands: UserCommands,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async getUsers(@Query('role') role?: UserRole): Promise<UserResponse[]> {
    return this.userQuery.getUsers(role);
  }

  // Any authenticated user submits their own national ID for admin review.
  @Patch('me/national-id')
  async submitNationalId(
    @CurrentUser() currentUser: UserEntity,
    @Body() command: SubmitNationalIdCommand,
  ): Promise<UserResponse> {
    return this.userCommands.submitNationalId(currentUser.id, command);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() command: UpdateUserCommand,
  ): Promise<UserResponse> {
    return this.userCommands.updateUser(id, command);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async archiveUser(@Param('id') id: string): Promise<void> {
    return this.userCommands.archiveUser(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post(':id/restore')
  async restoreUser(@Param('id') id: string): Promise<void> {
    return this.userCommands.restoreUser(id);
  }
}
