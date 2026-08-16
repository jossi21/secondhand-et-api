import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../persistence/categories/category.entity';

export class CategoryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  parentId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: () => [CategoryResponse], required: false })
  children?: CategoryResponse[];

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: CategoryEntity): CategoryResponse {
    const response = new CategoryResponse();

    response.id = entity.id;
    response.name = entity.name;
    response.slug = entity.slug;
    response.description = entity.description;
    response.parentId = entity.parentId;
    response.isActive = entity.isActive;
    response.createdAt = entity.createdAt;

    if (entity.children) {
      response.children = entity.children.map((child) =>
        CategoryResponse.fromEntity(child),
      );
    }

    return response;
  }
}
