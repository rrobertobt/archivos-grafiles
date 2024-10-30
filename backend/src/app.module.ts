import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./auth/constants";
import { DirectoriesModule } from "./directories/directories.module";
import { FilesModule } from "./files/files.module";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
      {
        authMechanism: "DEFAULT",
        dbName: process.env.MONGO_DB_NAME,
        auth: {
          password: process.env.MONGO_PASSWORD,
          username: process.env.MONGO_USER,
        },
      },
    ),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "168h" },
    }),
    AuthModule,
    UsersModule,
    DirectoriesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
