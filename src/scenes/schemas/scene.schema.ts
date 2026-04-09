import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SceneDocument = HydratedDocument<Scene>;

@Schema({ timestamps: true })
export class Scene {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false })
  @Prop()
  background_image?: string;

  @ApiProperty({ required: false })
  @Prop({ type: Number, default: 20 })
  grid_width!: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number, default: 20 })
  grid_height!: number;

  @ApiProperty({ required: false })
  @Prop()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @Prop({ type: Boolean, default: false })
  is_active!: boolean;

  @ApiProperty({ description: 'Campaign this scene belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const SceneSchema = SchemaFactory.createForClass(Scene);
