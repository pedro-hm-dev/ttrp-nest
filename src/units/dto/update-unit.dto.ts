import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MapLayer } from '../../common/enums/map-layer.enum.js';
import { UnitType } from '../../common/enums/unit-type.enum.js';

export class UpdateUnitDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: UnitType, required: false })
  @IsEnum(UnitType)
  @IsOptional()
  type?: UnitType;

  @ApiProperty({ enum: MapLayer, required: false })
  @IsEnum(MapLayer)
  @IsOptional()
  layer?: MapLayer;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  width?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  height?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  rotation?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  character?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  properties?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  locked?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
