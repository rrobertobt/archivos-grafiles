import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/auth/entities/user.entity";
import { File } from "./file.entity";

export type ArchiveDocument = HydratedDocument<Archive>;

@Schema({ collection: 'archives' })
export class Archive {
  @Prop()
  name: string;

  @Prop()
  type: "directory" | "file";

  @Prop()
  mime_type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Archive' })
  parent_directory: Archive;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  path: string;

  @Prop({ default: false })
  in_trash: boolean;

  @Prop({ default: new Date() })
  created_at: Date;

  @Prop()
  shared: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Archive' }], default: [] })
  subarchives: Archive[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'File' })
  file: File;
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
