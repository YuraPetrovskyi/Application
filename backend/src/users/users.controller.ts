import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EventsService } from '../events/events.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private eventsService: EventsService) {}

  @Get('me/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's events (organized + joined)" })
  @ApiResponse({ status: 200, description: "List of user's events" })
  async getMyEvents(@CurrentUser() user: any) {
    return this.eventsService.findUserEvents(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@CurrentUser() user: any) {
    return user;
  }
}
