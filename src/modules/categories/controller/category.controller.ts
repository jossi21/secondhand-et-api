import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../../libs/common/decorators/public.decorator';
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from '../usecase/category.commands';
import { CategoryCommands } from '../usecase/category.logic.commands';
import { CategoryQuery } from '../usecase/category.logic.query';
import { CategoryResponse } from '../usecase/category.response';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryCommands: CategoryCommands,
    private readonly categoryQuery: CategoryQuery,
  ) {}

  @Public()
  @Get('get-categories')
  async getCategories(): Promise<CategoryResponse[]> {
    return this.categoryQuery.getCategories();
  }

  @Public()
  @Get('category-tree')
  async getCategoryTree(): Promise<CategoryResponse[]> {
    return this.categoryQuery.getCategoryTree();
  }

  @Public()
  @Get('get-category:id')
  async getCategory(@Param('id') id: string): Promise<CategoryResponse> {
    return this.categoryQuery.getCategory(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('create-category')
  async createCategory(
    @Body() command: CreateCategoryCommand,
  ): Promise<CategoryResponse> {
    return this.categoryCommands.createCategory(command);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch('update-category:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() command: UpdateCategoryCommand,
  ): Promise<CategoryResponse> {
    return this.categoryCommands.updateCategory(id, command);
  }

  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('delete-category:id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryCommands.deleteCategory(id);
  }
}
