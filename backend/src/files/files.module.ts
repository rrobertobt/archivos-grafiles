import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { FileSchema } from "src/directories/entities/file.entity";
import { UsersModule } from "src/users/users.module";
import {
  Archive,
  ArchiveSchema,
} from "src/directories/entities/directory.entity";

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: Archive.name, schema: ArchiveSchema },
      { name: "uploads.files", schema: FileSchema },
    ]),
    UsersModule,
  ],
})
export class FilesModule {}
