import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available tags' })
  @ApiResponse({ status: 200, description: 'List of all tags' })
  async findAll() {
    return this.tagsService.findAll();
  }
}
