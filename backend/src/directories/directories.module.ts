import { Module } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { DirectoriesController } from './directories.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Archive, ArchiveSchema } from './entities/directory.entity';
import { FileSchema } from './entities/file.entity';

@Module({
  controllers: [DirectoriesController],
  providers: [DirectoriesService],
  imports: [MongooseModule.forFeature([{ name: Archive.name, schema: ArchiveSchema },
  { name: 'uploads.files', schema: FileSchema }

  ]), UsersModule],
})
export class DirectoriesModule { }
