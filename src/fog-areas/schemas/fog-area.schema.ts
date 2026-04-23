import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { FogAreaShape } from '../../common/enums/fog-area-shape.enum.js';

export type FogAreaDocument = HydratedDocument<FogArea>;

@Schema({ timestamps: true })
export class FogArea {
  @ApiProperty({ enum: FogAreaShape })
  @Prop({ type: String, enum: FogAreaShape, required: true })
  shape!: FogAreaShape;

  @ApiProperty({
    description:
      'Points defining the polygon, or two corners for rect [{x,y},{x,y}]',
    type: 'array',
    items: { type: 'object' },
  })
  @Prop({ type: [{ x: Number, y: Number }], required: true })
  points!: { x: number; y: number }[];

  @ApiProperty({
    default: true,
    description: 'true = revealed area, false = hidden area (re-fog)',
  })
  @Prop({ type: Boolean, default: true })
  revealed!: boolean;

  @ApiProperty({ description: 'Scene this fog area belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Scene', required: true, index: true })
  scene!: Types.ObjectId;

  @ApiProperty({ description: 'Campaign this fog area belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const FogAreaSchema = SchemaFactory.createForClass(FogArea);
