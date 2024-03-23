import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Role } from 'src/common/enums';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Field(() => String)
  @Prop({ type: String, required: true })
  username: string;

  @Field(() => Int, { nullable: true })
  @Prop({ type: String })
  age?: number;

  @Field(() => String)
  @Prop({
    type: String,
    unique: true,
    index: true,
    sparse: true,
    trim: true,
    lowercase: true,
    required: true,
  })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Field(() => [String])
  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: String, select: false })
  hashRefreshToken?: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;

  @Prop({ type: String, select: false })
  emailVerifiedToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<User>;
