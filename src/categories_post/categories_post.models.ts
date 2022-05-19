import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoriesPostDocument = CategoriesPost & Document;

@Schema({ timestamps: true })
export class CategoriesPost {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({})
  description: string;
}

export const CategoriesPostSchema = SchemaFactory.createForClass(
  CategoriesPost,
);
