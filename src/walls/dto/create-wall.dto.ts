import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WallType } from '../../common/enums/wall-type.enum.js';
import { PointDto } from '../../drawings/dto/create-drawing.dto.js';

export class CreateWallDto {
  @ApiProperty({ enum: WallType, example: 'wall' })
  @IsEnum(WallType)
  type!: WallType;

  @ApiProperty({ type: [PointDto], minItems: 2 })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points!: PointDto[];

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  blocksVision?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  blocksMovement?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  oneWay?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  color?: string;

  @ApiProperty({ description: 'Scene ID' })
  @IsMongoId()
  scene_id!: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
