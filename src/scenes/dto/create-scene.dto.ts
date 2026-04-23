import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { GridType } from '../../common/enums/grid-type.enum.js';

export class CreateSceneDto {
  @ApiProperty({ example: 'Tavern Brawl' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false, example: 'https://example.com/map.jpg' })
  @IsString()
  @IsOptional()
  background_image?: string;

  @ApiProperty({ required: false, default: '#f5f5dc', example: '#f5f5dc' })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  background_color?: string;

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

  @ApiProperty({ enum: GridType, required: false, default: 'square' })
  @IsEnum(GridType)
  @IsOptional()
  grid_type?: GridType;

  @ApiProperty({
    required: false,
    default: 70,
    description: 'Cell size in pixels',
  })
  @IsInt()
  @Min(10)
  @IsOptional()
  cell_size?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  fog_of_war?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
