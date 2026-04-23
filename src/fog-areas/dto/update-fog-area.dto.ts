import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FogAreaShape } from '../../common/enums/fog-area-shape.enum.js';
import { PointDto } from '../../drawings/dto/create-drawing.dto.js';

export class UpdateFogAreaDto {
  @ApiProperty({ enum: FogAreaShape, required: false })
  @IsEnum(FogAreaShape)
  @IsOptional()
  shape?: FogAreaShape;

  @ApiProperty({ type: [PointDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  @IsOptional()
  points?: PointDto[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  revealed?: boolean;
}
