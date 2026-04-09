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
    example: { strength: 10, dexterity: 14 },
    description: 'Free-form attribute map',
  })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, unknown>;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Campaign ID' })
  @IsMongoId()
  campaign_id!: string;
}
