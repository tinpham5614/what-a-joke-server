import { Prop, Schema } from '@nestjs/mongoose';
import { User } from 'src/users/schema/user.schema';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Joke {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User;

  @Prop({ required: true })
  joke: string;

  @Prop({ default: 0 })
  favoriteCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}
