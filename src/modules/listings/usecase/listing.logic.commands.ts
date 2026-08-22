import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import { CategoryRepository } from '../../categories/persistence/categories/category.repository';
import { ListingRepository } from '../persistence/listings/listing.repository';
import { ListingImageEntity } from '../persistence/listings/listing-image.entity';
import { CreateListingCommand, UpdateListingCommand } from './listing.commands';
import { ListingResponse } from './listing.response';

@Injectable()
export class ListingCommands {
  constructor(
    private readonly listingRepository: ListingRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  private assertOwnerOrAdmin(sellerId: string, currentUser: UserEntity) {
    const isOwner = sellerId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You do not own this listing');
    }
  }

  async createListing(
    command: CreateListingCommand,
    currentUser: UserEntity,
  ): Promise<ListingResponse> {
    const category = await this.categoryRepository.getById(command.categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category not found with id ${command.categoryId}`,
      );
    }

    const listing = CreateListingCommand.fromCommand(command, currentUser);

    if (command.imageUrls && command.imageUrls.length > 0) {
      listing.images = command.imageUrls.map((url, index) => {
        const image = new ListingImageEntity();
        image.url = url;
        image.sortOrder = index;
        return image;
      });
    }

    const saved = await this.listingRepository.createListing(listing);
    const withRelations = await this.listingRepository.getById(saved.id);

    return ListingResponse.fromEntity(withRelations!);
  }

  async updateListing(
    id: string,
    command: UpdateListingCommand,
    currentUser: UserEntity,
  ): Promise<ListingResponse> {
    const existing = await this.listingRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Listing not found with id ${id}`);
    }

    this.assertOwnerOrAdmin(existing.sellerId, currentUser);

    if (command.categoryId) {
      const category = await this.categoryRepository.getById(
        command.categoryId,
      );
      if (!category) {
        throw new NotFoundException(
          `Category not found with id ${command.categoryId}`,
        );
      }
    }

    await this.listingRepository.updateListing(id, {
      title: command.title ?? existing.title,
      description: command.description ?? existing.description,
      price: command.price ?? existing.price,
      condition: command.condition ?? existing.condition,
      city: command.city ?? existing.city,
      neighborhood: command.neighborhood ?? existing.neighborhood,
      categoryId: command.categoryId ?? existing.categoryId,
      status: command.status ?? existing.status,
      updatedBy: currentUser.id,
    });

    if (command.imageUrls) {
      const images = command.imageUrls.map((url, index) => {
        const image = new ListingImageEntity();
        image.url = url;
        image.sortOrder = index;
        image.listingId = id;
        return image;
      });
      await this.listingRepository.replaceImages(id, images);
    }

    const updated = await this.listingRepository.getById(id);
    return ListingResponse.fromEntity(updated!);
  }

  async deleteListing(id: string, currentUser: UserEntity): Promise<void> {
    const existing = await this.listingRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Listing not found with id ${id}`);
    }

    this.assertOwnerOrAdmin(existing.sellerId, currentUser);

    await this.listingRepository.softDelete(id);
  }
}
