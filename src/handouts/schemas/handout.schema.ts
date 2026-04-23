import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type HandoutDocument = HydratedDocument<Handout>;

@Schema({ timestamps: true })
export class Handout {
  @ApiProperty()
  @Prop({ required: true, trim: true })
  name!: string;

  @ApiProperty({ required: false, description: 'Rich text / markdown body' })
  @Prop()
  body?: string;

  @ApiProperty({ required: false, description: 'Image URL' })
  @Prop()
  image?: string;

  @ApiProperty({
    required: false,
    description: 'Private GM-only notes',
  })
  @Prop()
  gmNotes?: string;

  @ApiProperty({
    description: 'Player IDs who can see this handout. Empty = GM only.',
    type: [String],
  })
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  visibleTo!: Types.ObjectId[];

  @ApiProperty({ description: 'Campaign this handout belongs to' })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true, index: true })
  campaign!: Types.ObjectId;
}

export const HandoutSchema = SchemaFactory.createForClass(Handout);
