import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DrawingType } from '../../common/enums/drawing-type.enum.js';
import { MapLayer } from '../../common/enums/map-layer.enum.js';

export class PointDto {
  @ApiProperty()
  @IsNumber()
  x!: number;

  @ApiProperty()
  @IsNumber()
  y!: number;
}

export class CreateDrawingDto {
  @ApiProperty({ enum: DrawingType })
  @IsEnum(DrawingType)
  type!: DrawingType;

  @ApiProperty({ enum: MapLayer, required: false, default: 'players' })
  @IsEnum(MapLayer)
  @IsOptional()
  layer?: MapLayer;

  @ApiProperty({ type: [PointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points!: PointDto[];

  @ApiProperty({ required: false, default: '#000000' })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  strokeColor?: string;

  @ApiProperty({ required: false, default: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  strokeWidth?: number;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  fillColor?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  opacity?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  fontSize?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  radius?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  width?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Scene ID' })
  @IsMongoId()
  scene_id!: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
