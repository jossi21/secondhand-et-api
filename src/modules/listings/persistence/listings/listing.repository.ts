import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListingEntity, ListingStatus } from './listing.entity';
import { ListingImageEntity } from './listing-image.entity';

export interface ListingFilters {
  q?: string;
  categoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ListingStatus | 'all';
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
  async replaceImages(
    listingId: string,
    images: ListingImageEntity[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(ListingImageEntity, { listingId });
      if (images.length > 0) {
        await manager.save(ListingImageEntity, images);
      }
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

    if (filters.status && filters.status !== 'all') {
      query.andWhere('listing.status = :status', { status: filters.status });
    } else if (!filters.status) {
      // No status specified at all (public browse) — default to active only.
      query.andWhere('listing.status = :status', {
        status: ListingStatus.ACTIVE,
      });
    }
    // filters.status === 'all' → no status filter, every status included.

    query
      .orderBy('listing.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async getSellerStats(
    sellerId: string,
  ): Promise<{ active: number; sold: number; totalViews: number }> {
    const result = await this.createQueryBuilder('listing')
      .select('COUNT(*) FILTER (WHERE listing.status = :active)', 'active')
      .addSelect('COUNT(*) FILTER (WHERE listing.status = :sold)', 'sold')
      .addSelect('COALESCE(SUM(listing.viewCount), 0)', 'totalviews')
      .where('listing.sellerId = :sellerId', { sellerId })
      .setParameters({ active: ListingStatus.ACTIVE, sold: ListingStatus.SOLD })
      .getRawOne<{ active: string; sold: string; totalviews: string }>();

    return {
      active: parseInt(result?.active ?? '0', 10),
      sold: parseInt(result?.sold ?? '0', 10),
      totalViews: parseInt(result?.totalviews ?? '0', 10),
    };
  }

  async getBySeller(sellerId: string): Promise<ListingEntity[]> {
    return this.find({
      where: { sellerId },
      relations: ['images', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPlatformStats(): Promise<{
    activeListings: number;
    soldListings: number;
    citiesCovered: number;
  }> {
    const result = await this.createQueryBuilder('listing')
      .select('COUNT(*) FILTER (WHERE listing.status = :active)', 'active')
      .addSelect('COUNT(*) FILTER (WHERE listing.status = :sold)', 'sold')
      .addSelect('COUNT(DISTINCT listing.city)', 'cities')
      .setParameters({ active: ListingStatus.ACTIVE, sold: ListingStatus.SOLD })
      .getRawOne<{ active: string; sold: string; cities: string }>();

    return {
      activeListings: parseInt(result?.active ?? '0', 10),
      soldListings: parseInt(result?.sold ?? '0', 10),
      citiesCovered: parseInt(result?.cities ?? '0', 10),
    };
  }
}
