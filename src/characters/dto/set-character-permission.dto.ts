import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { CharacterPermission } from '../../common/enums/character-permission.enum.js';

export class SetCharacterPermissionDto {
  @ApiProperty({ description: 'Player user ID' })
  @IsMongoId()
  player_id!: string;

  @ApiProperty({ enum: CharacterPermission, example: 'view' })
  @IsEnum(CharacterPermission)
  level!: CharacterPermission;
}
