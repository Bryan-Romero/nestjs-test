import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PickType } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums';

@Schema({ timestamps: true })
export class User extends PickType(Document, ['_id'] as const) {
  @Prop({ type: Boolean, default: true, select: false })
  active: boolean;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  age: number;

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

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  // Document prop
  _id: Types.ObjectId;

  // Timestamps props
  createdAt: Date;
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
