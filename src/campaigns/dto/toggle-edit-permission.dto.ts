import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { PlayerPermission } from '../../common/enums/player-permission.enum.js';

export class SetPermissionDto {
  @ApiProperty({ description: 'Player user ID' })
  @IsMongoId()
  player_id!: string;

  @ApiProperty({ enum: PlayerPermission, example: 'edit' })
  @IsEnum(PlayerPermission)
  level!: PlayerPermission;
}
