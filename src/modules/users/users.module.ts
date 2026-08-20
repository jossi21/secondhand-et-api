import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './persistence/users/user.entity';
import { UserRepository } from './persistence/users/user.repository';
import { UserController } from './controller/user.controller';
import { UserQuery } from './usecase/user.query';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserRepository, UserQuery],
  exports: [UserRepository],
})
export class UsersModule {}
