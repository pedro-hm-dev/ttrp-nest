import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CharacterPermission } from '../../common/enums/character-permission.enum.js';

export class CharacterPermissionEntry {
  @ApiProperty({ description: 'Player user ID' })
  player!: Types.ObjectId;

  @ApiProperty({ enum: CharacterPermission, description: 'Permission level' })
  level!: CharacterPermission;
}

export type CharacterDocument = HydratedDocument<Character>;

@Schema({ timestamps: true })
export class Character {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false })
  @Prop()
  avatar?: string;

  @ApiProperty({ required: false, description: 'Token image for map display' })
  @Prop()
  tokenImage?: string;

  @ApiProperty({ required: false })
  @Prop({ type: Object, default: {} })
  attributes!: Record<string, unknown>;

  @ApiProperty({ required: false, description: 'Public notes / bio' })
  @Prop()
  publicNotes?: string;

  @ApiProperty({
    required: false,
    description: 'Private GM-only notes',
  })
  @Prop()
  gmNotes?: string;

  @ApiProperty({
    type: [CharacterPermissionEntry],
    description: 'Per-player character permissions',
  })
  @Prop({
    type: [
      {
        player: { type: Types.ObjectId, ref: 'User' },
        level: {
          type: String,
          enum: CharacterPermission,
          default: CharacterPermission.VIEW,
        },
      },
    ],
    default: [],
  })
  permissions!: CharacterPermissionEntry[];

  @ApiProperty({ description: 'Campaign this character belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;

  @ApiProperty({ description: 'User who owns this character' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
