import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MapLayer } from '../../common/enums/map-layer.enum.js';
import { UnitType } from '../../common/enums/unit-type.enum.js';

export class CreateUnitDto {
  @ApiProperty({ example: 'Goblin Archer' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ enum: UnitType, example: 'character' })
  @IsEnum(UnitType)
  type!: UnitType;

  @ApiProperty({ enum: MapLayer, example: 'players', required: false })
  @IsEnum(MapLayer)
  @IsOptional()
  layer?: MapLayer;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  width?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  height?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  rotation?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({ required: false, description: 'Linked character ID' })
  @IsMongoId()
  @IsOptional()
  character?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @ApiProperty({ description: 'Scene ID' })
  @IsMongoId()
  scene_id!: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
