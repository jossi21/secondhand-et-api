import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserRole } from '../persistence/users/user-role.enum';
import { UserQuery } from '../usecase/user.query';
import { UserResponse } from '../usecase/user.response';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userQuery: UserQuery) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  async getUsers(@Query('role') role?: UserRole): Promise<UserResponse[]> {
    return this.userQuery.getUsers(role);
  }
}
