import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserRole } from './user-role.enum';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<UserEntity | null> {
    return this.findOne({ where: { id } });
  }

  async getByIdIncludingArchived(id: string): Promise<UserEntity | null> {
    return this.findOne({ where: { id }, withDeleted: true });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email } });
  }

  async getByPhone(phone: string): Promise<UserEntity | null> {
    return this.findOne({ where: { phone } });
  }

  async createUser(entity: UserEntity): Promise<UserEntity> {
    return this.save(entity);
  }

  async updateUser(
    id: string,
    entity: Partial<UserEntity>,
  ): Promise<UserEntity> {
    await this.save({ id, ...entity });
    return this.getById(id) as Promise<UserEntity>;
  }

  async archiveUser(id: string): Promise<void> {
    await this.softDelete(id);
  }

  async restoreUser(id: string): Promise<void> {
    await this.restore(id);
  }

  async countVerifiedSellers(): Promise<number> {
    return this.count({
      where: { role: UserRole.SELLER, isVerified: true },
    });
  }
}
