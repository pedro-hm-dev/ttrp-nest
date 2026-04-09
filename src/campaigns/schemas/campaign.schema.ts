import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PlayerPermission } from '../../common/enums/player-permission.enum.js';

export class CampaignPermission {
  @ApiProperty({ description: 'Player user ID' })
  player!: Types.ObjectId;

  @ApiProperty({ enum: PlayerPermission, description: 'Permission level' })
  level!: PlayerPermission;
}

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({ timestamps: true })
export class Campaign {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false })
  @Prop()
  cover?: string;

  @ApiProperty({ required: false })
  @Prop()
  logo?: string;

  @ApiProperty({ description: 'Owner user ID' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;

  @ApiProperty({ description: 'Player user IDs' })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  players!: Types.ObjectId[];

  @ApiProperty({
    type: [CampaignPermission],
    description: 'Per-player permission levels',
  })
  @Prop({
    type: [
      {
        player: { type: Types.ObjectId, ref: 'User' },
        level: {
          type: String,
          enum: PlayerPermission,
          default: PlayerPermission.VIEW,
        },
      },
    ],
    default: [],
  })
  permissions!: CampaignPermission[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
