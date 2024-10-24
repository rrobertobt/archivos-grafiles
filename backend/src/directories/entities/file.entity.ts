import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FileDocument = HydratedDocument<File>;

@Schema({ collection: 'uploads.files' })
export class File {
  @Prop()
  length: number;

  @Prop()
  chunkSize: number;

  @Prop()
  uploadDate: Date;

  @Prop()
  filename: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
