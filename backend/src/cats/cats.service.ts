import { Connection, Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cat } from './entities/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';
import { GridFSBucket } from 'mongodb';
import * as fs from 'fs';
import { Readable } from 'stream';

@Injectable()
export class CatsService {
  private readonly fileModel: GridFSBucket;
  constructor(
    @InjectModel(Cat.name) private catModel: Model<Cat>,
    @InjectConnection() private connection: Connection,
  ) {
    this.fileModel = new GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  create(createCatDto: CreateCatDto, file: Express.Multer.File) {
    try {
      const uploadStream = this.fileModel.openUploadStream(file.originalname);
      const readBuffer = new Readable();
      readBuffer.push(file.buffer);
      readBuffer.push(null);

      readBuffer.pipe(uploadStream);
      console.log(uploadStream.id, 'uploadStream.id');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    // fs.createReadStream('./test.txt')
    //   .pipe
    //   // this.fileModel.openUploadStream('test.txt'),
    //   // this.fileModel.
    //   ();
    // const createdCat = new this.catModel(createCatDto);
    // return createdCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
