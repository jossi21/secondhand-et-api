import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './persistence/categories/category.entity';
import { CategoryRepository } from './persistence/categories/category.repository';
import { CategoryController } from './controller/category.controller';
import { CategoryCommands } from './usecase/category.logic.commands';
import { CategoryQuery } from './usecase/category.logic.query';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryRepository, CategoryCommands, CategoryQuery],
  exports: [CategoryRepository],
})
export class CategoriesModule {}
