import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<CategoryEntity | null> {
    return this.findOne({ where: { id }, relations: ['parent', 'children'] });
  }

  async getByName(name: string): Promise<CategoryEntity | null> {
    return this.findOne({ where: { name } });
  }

  async createCategory(entity: CategoryEntity): Promise<CategoryEntity> {
    return this.save(entity);
  }

  async updateCategory(
    id: string,
    entity: Partial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    await this.save({ id, ...entity });
    return this.getById(id) as Promise<CategoryEntity>;
  }

  async getTree(): Promise<CategoryEntity[]> {
    return this.find({
      where: { parentId: IsNull() },
      relations: ['children'],
      order: { name: 'ASC' },
    });
  }

  async getAll(): Promise<CategoryEntity[]> {
    return this.find({ order: { name: 'ASC' } });
  }
}
