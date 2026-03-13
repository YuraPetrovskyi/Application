import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { AskAiDto } from './dto/ask-ai.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('ask')
  // 30 AI requests per 60 seconds per user — aligned with Groq free tier limit
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  async ask(
    @Body() dto: AskAiDto,
    @CurrentUser() user: { id: string },
  ): Promise<{ answer: string }> {
    const answer = await this.aiService.ask(dto.question, user.id);
    return { answer };
  }
}
