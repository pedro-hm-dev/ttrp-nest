import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({ example: 'Gandalf' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false, example: 'https://example.com/avatar.png' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    required: false,
    example: 'https://example.com/token.png',
    description: 'Token image for map display',
  })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({
    required: false,
    example: { strength: 10, dexterity: 14 },
    description: 'Free-form attribute map',
  })
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

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
