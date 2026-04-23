import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { CampaignRole } from '../../common/enums/campaign-role.enum.js';

export class InvitePlayerDto {
  @ApiProperty({ example: 'player@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: CampaignRole,
    example: 'play',
    required: false,
    default: 'play',
  })
  @IsEnum(CampaignRole)
  @IsOptional()
  role?: CampaignRole;
}
