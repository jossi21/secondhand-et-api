import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../persistence/categories/category.repository';
import { CategoryEntity } from '../persistence/categories/category.entity';
import {
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from './category.commands';
import { CategoryResponse } from './category.response';

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

@Injectable()
export class CategoryCommands {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private async validateParent(parentId?: string, id?: string) {
    if (!parentId) return;

    if (parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    const parent = await this.categoryRepository.getById(parentId);
    if (!parent) {
      throw new BadRequestException(
        `Parent category not found with id ${parentId}`,
      );
    }
  }

  async createCategory(
    command: CreateCategoryCommand,
  ): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.getByName(command.name);
    if (existing) {
      throw new ConflictException('Category name already exists');
    }

    await this.validateParent(command.parentId);

    const category = new CategoryEntity();
    category.name = command.name;
    category.slug = slugify(command.name);
    category.description = command.description;
    category.parentId = command.parentId;

    const saved = await this.categoryRepository.createCategory(category);
    return CategoryResponse.fromEntity(saved);
  }

  async updateCategory(
    id: string,
    command: UpdateCategoryCommand,
  ): Promise<CategoryResponse> {
    const existing = await this.categoryRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Category not found with id ${id}`);
    }

    await this.validateParent(command.parentId, id);

    const updated = await this.categoryRepository.updateCategory(id, {
      name: command.name,
      slug: slugify(command.name),
      description: command.description,
      parentId: command.parentId,
      isActive: command.isActive ?? existing.isActive,
    });

    return CategoryResponse.fromEntity(updated);
  }

  async deleteCategory(id: string): Promise<void> {
    const existing = await this.categoryRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Category not found with id ${id}`);
    }

    await this.categoryRepository.softDelete(id);
  }
}
