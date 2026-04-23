import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WallType } from '../../common/enums/wall-type.enum.js';
import { PointDto } from '../../drawings/dto/create-drawing.dto.js';

export class UpdateWallDto {
  @ApiProperty({ enum: WallType, required: false })
  @IsEnum(WallType)
  @IsOptional()
  type?: WallType;

  @ApiProperty({ type: [PointDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  @IsOptional()
  points?: PointDto[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  blocksVision?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  blocksMovement?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  oneWay?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @Matches(/^#[0-9a-fA-F]{6}$/)
  @IsOptional()
  color?: string;
}
