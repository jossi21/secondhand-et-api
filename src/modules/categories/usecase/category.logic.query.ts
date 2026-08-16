import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../persistence/categories/category.repository';
import { CategoryResponse } from './category.response';

@Injectable()
export class CategoryQuery {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategory(id: string): Promise<CategoryResponse> {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundException(`Category not found with id ${id}`);
    }
    return CategoryResponse.fromEntity(category);
  }

  async getCategories(): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.getAll();
    return categories.map((c) => CategoryResponse.fromEntity(c));
  }

  async getCategoryTree(): Promise<CategoryResponse[]> {
    const categories = await this.categoryRepository.getTree();
    return categories.map((c) => CategoryResponse.fromEntity(c));
  }
}
