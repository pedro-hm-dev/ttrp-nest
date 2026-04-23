import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DrawingType } from '../../common/enums/drawing-type.enum.js';
import { MapLayer } from '../../common/enums/map-layer.enum.js';

export type DrawingDocument = HydratedDocument<Drawing>;

@Schema({ timestamps: true })
export class Drawing {
  @ApiProperty({ enum: DrawingType })
  @Prop({ type: String, enum: DrawingType, required: true })
  type!: DrawingType;

  @ApiProperty({ enum: MapLayer, default: MapLayer.PLAYERS })
  @Prop({ type: String, enum: MapLayer, default: MapLayer.PLAYERS })
  layer!: MapLayer;

  @ApiProperty({
    description: 'Array of {x,y} points defining the shape / path',
    type: 'array',
    items: { type: 'object' },
  })
  @Prop({ type: [{ x: Number, y: Number }], default: [] })
  points!: { x: number; y: number }[];

  @ApiProperty({
    required: false,
    description: 'Stroke color (hex)',
    default: '#000000',
  })
  @Prop({ type: String, default: '#000000' })
  strokeColor!: string;

  @ApiProperty({ required: false, default: 2 })
  @Prop({ type: Number, default: 2 })
  strokeWidth!: number;

  @ApiProperty({
    required: false,
    description: 'Fill color (hex). Null = no fill',
  })
  @Prop()
  fillColor?: string;

  @ApiProperty({ required: false, default: 1 })
  @Prop({ type: Number, default: 1, min: 0, max: 1 })
  opacity!: number;

  @ApiProperty({
    required: false,
    description: 'Text content (only for type=text)',
  })
  @Prop()
  text?: string;

  @ApiProperty({ required: false, description: 'Font size for text drawings' })
  @Prop({ type: Number })
  fontSize?: number;

  @ApiProperty({
    required: false,
    description: 'Radius (for circle type)',
  })
  @Prop({ type: Number })
  radius?: number;

  @ApiProperty({
    required: false,
    description: 'Width (for rect type)',
  })
  @Prop({ type: Number })
  width?: number;

  @ApiProperty({
    required: false,
    description: 'Height (for rect type)',
  })
  @Prop({ type: Number })
  height?: number;

  @ApiProperty({ description: 'Scene this drawing belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Scene', required: true, index: true })
  scene!: Types.ObjectId;

  @ApiProperty({ description: 'Campaign this drawing belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;

  @ApiProperty({ description: 'User who created this drawing' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy!: Types.ObjectId;
}

export const DrawingSchema = SchemaFactory.createForClass(Drawing);
