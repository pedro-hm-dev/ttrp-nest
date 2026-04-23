import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignRole } from '../../common/enums/campaign-role.enum.js';

export class CampaignMember {
  @ApiProperty({ description: 'Player user ID' })
  player!: Types.ObjectId;

  @ApiProperty({ enum: CampaignRole, description: 'Campaign role' })
  role!: CampaignRole;
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
    type: [CampaignMember],
    description: 'Per-player campaign roles',
  })
  @Prop({
    type: [
      {
        player: { type: Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: CampaignRole,
          default: CampaignRole.PLAY,
        },
      },
    ],
    default: [],
  })
  permissions!: CampaignMember[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
