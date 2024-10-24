import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchiveDto } from './dto/create-directory.dto';
import { UpdateArchiveDto } from './dto/update-directory.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Archive } from './entities/directory.entity';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

@Injectable()
export class DirectoriesService {
  private readonly fileModel: GridFSBucket;
  constructor(
    @InjectModel(Archive.name) private archiveModel: Model<Archive>,
    @InjectConnection() private connection: Connection,
    private usersService: UsersService,
  ) { 
    this.fileModel = new GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  async upload(userId: string, folderId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Archivo a subir no encontrado');
    }

    const allowedTypes = ['text/plain', 'image/png', 'image/jpeg', 'text/html'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido');
    }
    
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const directory = await this.archiveModel.findOne({
      _id: folderId,
      owner: userId,
      in_trash: false,
    });
    if (!directory) {
      throw new NotFoundException('Directorio no encontrado');
    }

    const uploadStream = this.fileModel.openUploadStream(file.originalname);
    const readBuffer = new Readable();
    readBuffer.push(file.buffer);
    readBuffer.push(null);

    readBuffer.pipe(uploadStream);
    const path = `${directory.path}/${file.originalname}`;
    const newArchive = new this.archiveModel({
      name: file.originalname,
      owner: user._id,
      mime_type: file.mimetype,
      file: uploadStream.id,
      parent_directory: directory._id,
      type: 'file',
      path,
    });
    await newArchive.save();
    directory.subarchives.push(newArchive);
    await directory.save();
    return newArchive;
  }

  async findAllTrash(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }
    const directories = await this.archiveModel.find({
      in_trash: true,
    }).select(['-subarchives'])
      .populate({
        path: 'owner',
        select: ['username', 'name']
      });
    return { results: directories };
  }
  async create(createArchiveDto: CreateArchiveDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const parentDirectory = await this.archiveModel.findOne({
      _id: createArchiveDto.parent_directory,
      in_trash: false,
    });
    if (!parentDirectory) {
      throw new NotFoundException('Directorio padre no encontrado');
    }

    const path = `${parentDirectory.path}/${createArchiveDto.name}`;

    const directory = new this.archiveModel({
      ...createArchiveDto,
      owner: user._id,
      path
    });
    await directory.save();
    parentDirectory.subarchives.push(directory);
    await parentDirectory.save();
    return directory;
  }

  private async getBreadcrumb(folderId: string): Promise<any> {
    const folder = await this.archiveModel.findById(folderId).select(['path']);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const pathSegments = folder.path.split('/');
    const breadcrumb = [];

    for (let i = 1; i < pathSegments.length; i++) {
      const pathSegment = pathSegments.slice(0, i + 1).join('/');
      const folderAtLevel = await this.archiveModel.findOne({ path: pathSegment }).select(['_id', 'name', 'parent_directory'])
      breadcrumb.push(folderAtLevel);
    }

    return breadcrumb;
  }


  findAll() {
    return `This action returns all directories`;
  }

  async findOneFromUser(folderId: string, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const directory = await this.archiveModel.findOne({
      _id: folderId,
      owner: userId,
      in_trash: false,
    }).populate({
      path: 'subarchives',
      match: { in_trash: false },
    });
    if (!directory) {
      throw new NotFoundException('Directorio no encontrado');
    }
    return {
      results: directory,
      display_path: await this.getBreadcrumb(folderId),
    }
  }

  update(id: number, updateArchiveDto: UpdateArchiveDto) {
    return `This action updates a #${id} directory`;
  }

  async removeFile(directoryId: string, fileId:string,userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const file = await this.archiveModel.findOne({
      type: 'file',
      _id: fileId,
      parent_directory: directoryId,
      owner: userId,
      in_trash: false,
    });
    if (!file) {
      throw new NotFoundException('Archivo no encontrado');
    }
    file.in_trash = true;
    await file.save();
    return file;
  }

  async remove(id: string, userId: string) {
    console.log({ id, userId });
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const directory = await this.archiveModel.findOne({
      type: 'directory',
      _id: id,
      owner: userId,
      in_trash: false,
    });
    if (!directory) {
      throw new NotFoundException('Directorio no encontrado');
    }
    directory.in_trash = true;
    await directory.save();
    return directory;
  }
}
