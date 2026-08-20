import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RatingEntity } from './rating.entity';

@Injectable()
export class RatingRepository extends Repository<RatingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RatingEntity, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<RatingEntity | null> {
    return this.findOne({ where: { id } });
  }

  async findByFromAndTo(
    fromUserId: string,
    toUserId: string,
  ): Promise<RatingEntity | null> {
    return this.findOne({ where: { fromUserId, toUserId } });
  }

  async getForSeller(toUserId: string): Promise<RatingEntity[]> {
    return this.find({
      where: { toUserId },
      relations: ['fromUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async createRating(entity: RatingEntity): Promise<RatingEntity> {
    return this.save(entity);
  }

  async updateRating(
    id: string,
    entity: Partial<RatingEntity>,
  ): Promise<RatingEntity> {
    await this.save({ id, ...entity });
    return this.getById(id) as Promise<RatingEntity>;
  }

  async getAverageForSeller(
    toUserId: string,
  ): Promise<{ average: number; count: number }> {
    const result = await this.createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.toUserId = :toUserId', { toUserId })
      .getRawOne<{ average: string | null; count: string }>();

    return {
      average: result?.average ? parseFloat(result.average) : 0,
      count: result?.count ? parseInt(result.count, 10) : 0,
    };
  }

  async getGivenByUser(fromUserId: string): Promise<RatingEntity[]> {
    return this.find({
      where: { fromUserId },
      relations: ['toUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAll(): Promise<RatingEntity[]> {
    return this.find({
      relations: ['fromUser', 'toUser'],
      order: { createdAt: 'DESC' },
    });
  }
}
