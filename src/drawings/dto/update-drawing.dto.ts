import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
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
import { PointDto } from './create-drawing.dto.js';

export class UpdateDrawingDto {
  @ApiProperty({ enum: DrawingType, required: false })
  @IsEnum(DrawingType)
  @IsOptional()
  type?: DrawingType;

  @ApiProperty({ enum: MapLayer, required: false })
  @IsEnum(MapLayer)
  @IsOptional()
  layer?: MapLayer;

  @ApiProperty({ type: [PointDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  @IsOptional()
  points?: PointDto[];

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  strokeColor?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  strokeWidth?: number;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  fillColor?: string;

  @ApiProperty({ required: false })
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
}
