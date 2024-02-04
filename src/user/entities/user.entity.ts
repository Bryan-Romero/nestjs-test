import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'src/common/enums';

@Schema({ timestamps: true })
export class User {
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
  })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
