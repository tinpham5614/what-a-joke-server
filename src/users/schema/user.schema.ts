import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

@Schema({
    timestamps: true,
})

export class User extends Document {
    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ unique: [true, 'Email already exists'] })
    email: string;

    @Prop()
    password: string;

    @Prop()
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
