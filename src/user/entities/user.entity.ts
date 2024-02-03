import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Boolean, default: true })
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

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
