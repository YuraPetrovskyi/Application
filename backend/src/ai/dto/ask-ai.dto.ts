import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AskAiDto {
  @ApiProperty({ example: 'What events do I have coming up?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question: string;
}
