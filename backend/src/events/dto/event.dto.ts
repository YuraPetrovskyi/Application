import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  ArrayMaxSize,
  Min,
} from 'class-validator';
import { Visibility } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Conference 2026' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A great tech conference' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-06-15T10:00:00.000Z' })
  @IsDateString()
  dateTime: string;

  @ApiProperty({ example: 'Kyiv, Ukraine' })
  @IsString()
  location: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number | null;

  @ApiPropertyOptional({ enum: Visibility, default: Visibility.PUBLIC })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @ApiPropertyOptional({
    type: [String],
    description: 'Array of tag IDs (max 5)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  tagIds?: string[];
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
