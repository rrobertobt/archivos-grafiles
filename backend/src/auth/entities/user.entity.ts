import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: 'admin' | 'employee';

  @Prop()
  name: string;

  @Prop()
  created_at: Date;

  // @Prop()
  // root_directory: string;

  // @Prop()
  // shared_directory: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
