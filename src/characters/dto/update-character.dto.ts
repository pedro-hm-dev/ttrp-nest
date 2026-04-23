import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateCharacterDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ required: false, description: 'Token image for map display' })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, unknown>;

  @ApiProperty({ required: false, description: 'Public notes / bio' })
  @IsString()
  @IsOptional()
  publicNotes?: string;

  @ApiProperty({ required: false, description: 'Private GM-only notes' })
  @IsString()
  @IsOptional()
  gmNotes?: string;
}
