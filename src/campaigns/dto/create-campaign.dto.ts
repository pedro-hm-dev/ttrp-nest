import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'The Lost Mines of Phandelver' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false, example: 'https://example.com/cover.jpg' })
  @IsString()
  @IsOptional()
  cover?: string;

  @ApiProperty({ required: false, example: 'https://example.com/logo.png' })
  @IsString()
  @IsOptional()
  logo?: string;
}
