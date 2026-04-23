import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { CampaignRole } from '../../common/enums/campaign-role.enum.js';

export class SetPermissionDto {
  @ApiProperty({ description: 'Player user ID' })
  @IsMongoId()
  player_id!: string;

  @ApiProperty({ enum: CampaignRole, example: 'play' })
  @IsEnum(CampaignRole)
  role!: CampaignRole;
}
