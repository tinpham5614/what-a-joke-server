import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ default: UserRole.USER })
    role: UserRole;

    @Prop()
    status: boolean;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;

    @Prop()
    deleted_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
