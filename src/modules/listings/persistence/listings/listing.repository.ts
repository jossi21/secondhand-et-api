import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListingEntity, ListingStatus } from './listing.entity';

export interface ListingFilters {
  q?: string;
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ListingStatus;
  sellerId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListingRepository extends Repository<ListingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ListingEntity, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<ListingEntity | null> {
    return this.findOne({
      where: { id },
      relations: ['images', 'category', 'seller'],
    });
  }

  async createListing(entity: ListingEntity): Promise<ListingEntity> {
    return this.save(entity);
  }

  async updateListing(
    id: string,
    entity: Partial<ListingEntity>,
  ): Promise<ListingEntity> {
    await this.save({ id, ...entity });
    return this.getById(id) as Promise<ListingEntity>;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.increment({ id }, 'viewCount', 1);
  }

  async search(
    filters: ListingFilters,
  ): Promise<{ data: ListingEntity[]; total: number }> {
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;

    const query = this.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.images', 'images')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.seller', 'seller');

    if (filters.q) {
      query.andWhere(
        '(listing.title ILIKE :q OR listing.description ILIKE :q)',
        { q: `%${filters.q}%` },
      );
    }

    if (filters.categoryId) {
      query.andWhere('listing.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.city) {
      query.andWhere('listing.city = :city', { city: filters.city });
    }

    if (filters.minPrice !== undefined) {
      query.andWhere('listing.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice !== undefined) {
      query.andWhere('listing.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.sellerId) {
      query.andWhere('listing.sellerId = :sellerId', {
        sellerId: filters.sellerId,
      });
    }

    query.andWhere('listing.status = :status', {
      status: filters.status ?? ListingStatus.ACTIVE,
    });

    query
      .orderBy('listing.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }
}
