import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateSceneDto {
  @ApiProperty({ example: 'Tavern Brawl' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false, example: 'https://example.com/map.jpg' })
  @IsString()
  @IsOptional()
  background_image?: string;

  @ApiProperty({ required: false, default: 20 })
  @IsInt()
  @Min(1)
  @IsOptional()
  grid_width?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsInt()
  @Min(1)
  @IsOptional()
  grid_height?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
