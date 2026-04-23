import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FogAreaShape } from '../../common/enums/fog-area-shape.enum.js';
import { PointDto } from '../../drawings/dto/create-drawing.dto.js';

export class CreateFogAreaDto {
  @ApiProperty({ enum: FogAreaShape, example: 'rect' })
  @IsEnum(FogAreaShape)
  shape!: FogAreaShape;

  @ApiProperty({ type: [PointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points!: PointDto[];

  @ApiProperty({
    required: false,
    default: true,
    description: 'true = reveal, false = re-fog',
  })
  @IsBoolean()
  @IsOptional()
  revealed?: boolean;

  @ApiProperty({ description: 'Scene ID' })
  @IsMongoId()
  scene_id!: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
