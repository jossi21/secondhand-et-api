import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import { UserRepository } from '../../users/persistence/users/user.repository';
import { RatingRepository } from '../persistence/ratings/rating.repository';
import { RatingEntity } from '../persistence/ratings/rating.entity';
import { CreateRatingCommand, UpdateRatingCommand } from './rating.commands';
import { RatingResponse } from './rating.response';

@Injectable()
export class RatingCommands {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createRating(
    command: CreateRatingCommand,
    currentUser: UserEntity,
  ): Promise<RatingResponse> {
    if (currentUser.role !== UserRole.BUYER) {
      throw new ForbiddenException('Only buyers can rate sellers');
    }

    if (command.toUserId === currentUser.id) {
      throw new BadRequestException('You cannot rate yourself');
    }

    const seller = await this.userRepository.getById(command.toUserId);
    if (!seller) {
      throw new NotFoundException(`User not found with id ${command.toUserId}`);
    }
    if (seller.role !== UserRole.SELLER) {
      throw new BadRequestException('You can only rate sellers');
    }

    const existing = await this.ratingRepository.findByFromAndTo(
      currentUser.id,
      command.toUserId,
    );
    if (existing) {
      throw new ConflictException(
        'You have already rated this seller. Update your existing rating instead.',
      );
    }

    const rating = new RatingEntity();
    rating.score = command.score;
    rating.comment = command.comment;
    rating.fromUserId = currentUser.id;
    rating.toUserId = command.toUserId;
    rating.createdBy = currentUser.id;

    const saved = await this.ratingRepository.createRating(rating);
    return RatingResponse.fromEntity(saved);
  }

  async updateRating(
    id: string,
    command: UpdateRatingCommand,
    currentUser: UserEntity,
  ): Promise<RatingResponse> {
    const existing = await this.ratingRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Rating not found with id ${id}`);
    }

    if (existing.fromUserId !== currentUser.id) {
      throw new ForbiddenException('You can only update your own rating');
    }

    const updated = await this.ratingRepository.updateRating(id, {
      score: command.score ?? existing.score,
      comment: command.comment ?? existing.comment,
      updatedBy: currentUser.id,
    });

    return RatingResponse.fromEntity(updated);
  }

  async deleteRating(id: string, currentUser: UserEntity): Promise<void> {
    const existing = await this.ratingRepository.getById(id);
    if (!existing) {
      throw new NotFoundException(`Rating not found with id ${id}`);
    }

    if (existing.fromUserId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own rating');
    }

    await this.ratingRepository.softDelete(id);
  }
}
