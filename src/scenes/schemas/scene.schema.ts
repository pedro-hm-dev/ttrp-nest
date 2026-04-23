import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { GridType } from '../../common/enums/grid-type.enum.js';

export type SceneDocument = HydratedDocument<Scene>;

@Schema({ timestamps: true })
export class Scene {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false })
  @Prop()
  background_image?: string;

  @ApiProperty({ required: false, default: '#f5f5dc' })
  @Prop({ type: String, default: '#f5f5dc' })
  background_color!: string;

  @ApiProperty({ required: false })
  @Prop({ type: Number, default: 20 })
  grid_width!: number;

  @ApiProperty({ required: false })
  @Prop({ type: Number, default: 20 })
  grid_height!: number;

  @ApiProperty({ enum: GridType, required: false, default: GridType.SQUARE })
  @Prop({ type: String, enum: GridType, default: GridType.SQUARE })
  grid_type!: GridType;

  @ApiProperty({
    required: false,
    default: 70,
    description: 'Cell size in pixels',
  })
  @Prop({ type: Number, default: 70 })
  cell_size!: number;

  @ApiProperty({ required: false })
  @Prop()
  description?: string;

  @ApiProperty({ required: false, default: false })
  @Prop({ type: Boolean, default: false })
  fog_of_war!: boolean;

  @ApiProperty({ required: false, default: false })
  @Prop({ type: Boolean, default: false })
  is_active!: boolean;

  @ApiProperty({ description: 'Campaign this scene belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const SceneSchema = SchemaFactory.createForClass(Scene);
