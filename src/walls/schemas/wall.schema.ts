import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { WallType } from '../../common/enums/wall-type.enum.js';

export type WallDocument = HydratedDocument<Wall>;

@Schema({ timestamps: true })
export class Wall {
  @ApiProperty({ enum: WallType })
  @Prop({ type: String, enum: WallType, required: true })
  type!: WallType;

  @ApiProperty({
    description: 'Ordered array of {x,y} points forming the wall segments',
    type: 'array',
    items: { type: 'object' },
  })
  @Prop({ type: [{ x: Number, y: Number }], required: true })
  points!: { x: number; y: number }[];

  @ApiProperty({
    default: true,
    description: 'Whether this wall blocks vision (line of sight)',
  })
  @Prop({ type: Boolean, default: true })
  blocksVision!: boolean;

  @ApiProperty({
    default: true,
    description: 'Whether this wall blocks movement',
  })
  @Prop({ type: Boolean, default: true })
  blocksMovement!: boolean;

  @ApiProperty({
    default: false,
    description: 'One-way vision (e.g. windows — see out, not in)',
  })
  @Prop({ type: Boolean, default: false })
  oneWay!: boolean;

  @ApiProperty({
    required: false,
    description: 'Color for visual representation in DM view',
  })
  @Prop({ type: String })
  color?: string;

  @ApiProperty({ description: 'Scene this wall belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Scene', required: true, index: true })
  scene!: Types.ObjectId;

  @ApiProperty({ description: 'Campaign this wall belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const WallSchema = SchemaFactory.createForClass(Wall);
