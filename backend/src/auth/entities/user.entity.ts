import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Archive } from "src/directories/entities/directory.entity";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: "admin" | "employee";

  @Prop()
  name: string;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Archive", default: null })
  root_directory: Archive;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Archive", default: null })
  shared_directory: Archive;
}

export const UserSchema = SchemaFactory.createForClass(User);
