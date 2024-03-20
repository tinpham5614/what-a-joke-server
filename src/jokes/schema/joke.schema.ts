import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import mongoose, { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'jokes',
})
export class Joke extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdByUser: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  updatedByUser: User;

  @Prop({ required: true })
  joke: string;

  @Prop({ default: 0 })
  favoriteCount: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const JokeSchema = SchemaFactory.createForClass(Joke);
