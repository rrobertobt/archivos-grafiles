import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/auth/entities/user.entity";
import { UsersController } from "./users.controller";
import {
  Archive,
  ArchiveSchema,
} from "src/directories/entities/directory.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema }]),
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
