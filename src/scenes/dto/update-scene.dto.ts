import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { GridType } from '../../common/enums/grid-type.enum.js';

export class UpdateSceneDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  background_image?: string;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  background_color?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  grid_width?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  grid_height?: number;

  @ApiProperty({ enum: GridType, required: false })
  @IsEnum(GridType)
  @IsOptional()
  grid_type?: GridType;

  @ApiProperty({ required: false, description: 'Cell size in pixels' })
  @IsInt()
  @Min(10)
  @IsOptional()
  cell_size?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  fog_of_war?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
