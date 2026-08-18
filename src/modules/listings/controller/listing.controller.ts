import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../libs/common/decorators/current-user.decorator';
import { Public } from '../../../libs/common/decorators/public.decorator';
import { Roles } from '../../../libs/common/decorators/roles.decorator';
import { RolesGuard } from '../../../libs/common/guards/roles.guard';
import { UserEntity } from '../../users/persistence/users/user.entity';
import { UserRole } from '../../users/persistence/users/user-role.enum';
import {
  CreateListingCommand,
  UpdateListingCommand,
} from '../usecase/listing.commands';
import { ListingQueryDto } from '../usecase/listing-query.dto';
import { ListingCommands } from '../usecase/listing.logic.commands';
import { ListingQuery } from '../usecase/listing.logic.query';
import {
  ListingResponse,
  PaginatedListingResponse,
} from '../usecase/listing.response';

@ApiTags('listings')
@Controller('listings')
export class ListingController {
  constructor(
    private readonly listingCommands: ListingCommands,
    private readonly listingQuery: ListingQuery,
  ) {}

  @Public()
  @Get()
  async searchListings(
    @Query() query: ListingQueryDto,
  ): Promise<PaginatedListingResponse> {
    return this.listingQuery.searchListings(query);
  }

  @Public()
  @Get(':id')
  async getListing(@Param('id') id: string): Promise<ListingResponse> {
    return this.listingQuery.getListing(id);
  }

  @ApiBearerAuth()
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async createListing(
    @Body() command: CreateListingCommand,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ListingResponse> {
    return this.listingCommands.createListing(command, currentUser);
  }

  @ApiBearerAuth()
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateListing(
    @Param('id') id: string,
    @Body() command: UpdateListingCommand,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<ListingResponse> {
    return this.listingCommands.updateListing(id, command, currentUser);
  }

  @ApiBearerAuth()
  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteListing(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<void> {
    return this.listingCommands.deleteListing(id, currentUser);
  }
}
