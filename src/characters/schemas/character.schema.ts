import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CharacterDocument = HydratedDocument<Character>;

@Schema({ timestamps: true })
export class Character {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false })
  @Prop()
  avatar?: string;

  @ApiProperty({ required: false })
  @Prop({ type: Object, default: {} })
  attributes!: Record<string, unknown>;

  @ApiProperty({ required: false })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Campaign this character belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;

  @ApiProperty({ description: 'User who owns this character' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
