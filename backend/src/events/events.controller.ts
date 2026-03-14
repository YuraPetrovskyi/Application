import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get paginated public events' })
  @ApiQuery({
    name: 'tagIds',
    required: false,
    type: [String],
    description: 'Filter by tag IDs',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Events per page (default: 12)',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of public events' })
  async findAll(
    @Request() req: any,
    @Query('tagIds') tagIds?: string | string[],
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?.id;
    const tagIdsArray = tagIds
      ? Array.isArray(tagIds)
        ? tagIds
        : [tagIds]
      : undefined;
    return this.eventsService.findAll(
      userId,
      tagIdsArray,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id;
    return this.eventsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created' })
  async create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (organizer only)' })
  @ApiResponse({ status: 200, description: 'Event updated' })
  @ApiResponse({ status: 403, description: 'Not the organizer' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @CurrentUser() user: any,
  ) {
    return this.eventsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete event (organizer only)' })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 403, description: 'Not the organizer' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.remove(id, user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join an event' })
  @ApiResponse({ status: 200, description: 'Joined event' })
  async join(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.join(id, user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave an event' })
  @ApiResponse({ status: 200, description: 'Left event' })
  async leave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.eventsService.leave(id, user.id);
  }
}
