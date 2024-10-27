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

  @Prop()
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Archive" })
  root_directory: Archive;

  // @Prop()
  // shared_directory: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
