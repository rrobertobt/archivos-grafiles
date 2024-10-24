import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchiveDto } from './dto/create-directory.dto';
import { UpdateArchiveDto } from './dto/update-directory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Archive } from './entities/directory.entity';

@Injectable()
export class DirectoriesService {
  constructor(
    @InjectModel(Archive.name) private archiveModel: Model<Archive>,
    private usersService: UsersService,
  ) { }

  async create(createArchiveDto: CreateArchiveDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const parentDirectory = await this.archiveModel.findOne({
      _id: createArchiveDto.parent_directory,
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
    }).populate('subarchives');
    if (!directory) {
      throw new NotFoundException('Directorio no encontrado');
    }
    // console.log(await this.getBreadcrumb(folderId));
    return {
      results: directory,
      display_path: await this.getBreadcrumb(folderId),
    }
  }

  update(id: number, updateArchiveDto: UpdateArchiveDto) {
    return `This action updates a #${id} directory`;
  }

  remove(id: number) {
    return `This action removes a #${id} directory`;
  }
}
