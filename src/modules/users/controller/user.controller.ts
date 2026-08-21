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
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserRole } from '../persistence/users/user-role.enum';
import { UpdateUserCommand } from '../usecase/user.commands';
import { UserCommands } from '../usecase/user.logic.commands';
import { UserQuery } from '../usecase/user.query';
import { UserResponse } from '../usecase/user.response';

@ApiTags('users')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userQuery: UserQuery,
    private readonly userCommands: UserCommands,
  ) {}

  @Get()
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async getUsers(@Query('role') role?: UserRole): Promise<UserResponse[]> {
    return this.userQuery.getUsers(role);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() command: UpdateUserCommand,
  ): Promise<UserResponse> {
    return this.userCommands.updateUser(id, command);
  }

  @Delete(':id')
  async archiveUser(@Param('id') id: string): Promise<void> {
    return this.userCommands.archiveUser(id);
  }

  @Post(':id/restore')
  async restoreUser(@Param('id') id: string): Promise<void> {
    return this.userCommands.restoreUser(id);
  }
}
