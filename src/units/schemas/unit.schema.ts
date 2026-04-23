import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { MapLayer } from '../../common/enums/map-layer.enum.js';
import { UnitType } from '../../common/enums/unit-type.enum.js';

export type UnitDocument = HydratedDocument<Unit>;

@Schema({ timestamps: true })
export class Unit {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ enum: UnitType })
  @Prop({ type: String, enum: UnitType, required: true })
  type!: UnitType;

  @ApiProperty({ enum: MapLayer, default: MapLayer.PLAYERS })
  @Prop({ type: String, enum: MapLayer, default: MapLayer.PLAYERS })
  layer!: MapLayer;

  @ApiProperty({ description: 'X position (grid cells)', default: 0 })
  @Prop({ type: Number, default: 0 })
  x!: number;

  @ApiProperty({ description: 'Y position (grid cells)', default: 0 })
  @Prop({ type: Number, default: 0 })
  y!: number;

  @ApiProperty({ description: 'Width in grid cells', default: 1 })
  @Prop({ type: Number, default: 1 })
  width!: number;

  @ApiProperty({ description: 'Height in grid cells', default: 1 })
  @Prop({ type: Number, default: 1 })
  height!: number;

  @ApiProperty({ description: 'Rotation in degrees', default: 0 })
  @Prop({ type: Number, default: 0 })
  rotation!: number;

  @ApiProperty({ required: false, description: 'Token image URL' })
  @Prop()
  tokenImage?: string;

  @ApiProperty({
    required: false,
    description: 'Linked character sheet ID',
  })
  @Prop({ type: Types.ObjectId, ref: 'Character' })
  character?: Types.ObjectId;

  @ApiProperty({
    required: false,
    description: 'Arbitrary properties (HP bars, status effects, etc.)',
  })
  @Prop({ type: Object, default: {} })
  properties!: Record<string, unknown>;

  @ApiProperty({ default: false })
  @Prop({ type: Boolean, default: false })
  locked!: boolean;

  @ApiProperty({
    default: true,
    description: 'Visible to players (DM layer units are always hidden)',
  })
  @Prop({ type: Boolean, default: true })
  visible!: boolean;

  @ApiProperty({ description: 'Scene this unit belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Scene', required: true, index: true })
  scene!: Types.ObjectId;

  @ApiProperty({ description: 'Campaign this unit belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
