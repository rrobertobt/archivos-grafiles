import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateArchiveDto } from "./dto/create-directory.dto";
import { MoveArchiveDto, UpdateArchiveDto } from "./dto/update-directory.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import { Archive, ArchiveDocument } from "./entities/directory.entity";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

@Injectable()
export class DirectoriesService {
  private readonly fileModel: GridFSBucket;
  constructor(
    @InjectModel(Archive.name) private archiveModel: Model<Archive>,
    @InjectConnection() private connection: Connection,
    private usersService: UsersService,
  ) {
    this.fileModel = new GridFSBucket(this.connection.db, {
      bucketName: "uploads",
    });
  }

  async upload(userId: string, folderId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Archivo a subir no encontrado");
    }

    const allowedTypes = ["text/plain", "image/png", "image/jpeg", "text/html"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException("Tipo de archivo no permitido");
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const directory = await this.archiveModel.findOne({
      _id: folderId,
      owner: userId,
      in_trash: false,
    });
    if (!directory) {
      throw new NotFoundException("Directorio no encontrado");
    }
    // also check if file with same name exists
    const existingFile = await this.archiveModel.findOne({
      name: file.originalname,
      parent_directory: directory._id,
      in_trash: false,
    });
    if (existingFile) {
      throw new BadRequestException("Archivo con el mismo nombre ya existe");
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
      type: "file",
      path,
    });
    await newArchive.save();
    directory.subarchives.push(newArchive);
    await directory.save();
    return newArchive;
  }

  async findAllTrash(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || user.role !== "admin") {
      throw new ForbiddenException(
        "No tienes permisos para realizar esta acción",
      );
    }
    const directories = await this.archiveModel
      .find({
        in_trash: true,
      })
      .select(["-subarchives"])
      .populate({
        path: "owner",
        select: ["username", "name"],
      });
    return { results: directories };
  }
  async create(createArchiveDto: CreateArchiveDto, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const parentDirectory = await this.archiveModel.findOne({
      _id: createArchiveDto.parent_directory,
      in_trash: false,
    });
    if (!parentDirectory) {
      throw new NotFoundException("Directorio padre no encontrado");
    }
    const existingDirectory = await this.archiveModel.findOne({
      name: createArchiveDto.name,
      parent_directory: parentDirectory._id,
      in_trash: false,
    });
    if (existingDirectory) {
      throw new BadRequestException("Directorio con el mismo nombre ya existe");
    }

    const path = `${parentDirectory.path}/${createArchiveDto.name}`;

    const directory = new this.archiveModel({
      ...createArchiveDto,
      owner: user._id,
      path,
    });
    await directory.save();
    parentDirectory.subarchives.push(directory);
    await parentDirectory.save();
    return directory;
  }

  private async getBreadcrumb(folderId: string): Promise<any> {
    const folder = await this.archiveModel.findById(folderId).select(["path"]);
    if (!folder) {
      throw new NotFoundException("Folder not found");
    }

    const pathSegments = folder.path.split("/");
    const breadcrumb = [];

    for (let i = 1; i < pathSegments.length; i++) {
      const pathSegment = pathSegments.slice(0, i + 1).join("/");
      const folderAtLevel = await this.archiveModel
        .findOne({ path: pathSegment })
        .select(["_id", "name", "parent_directory"]);
      breadcrumb.push(folderAtLevel);
    }

    return breadcrumb;
  }

  // this function is mostly used to generate a structure for a Tree display component on the frontend
  async findOnlyFolders(userId: string, directoryId?: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException("Usuario no encontrado");

    const directory = await this.archiveModel
      .findOne({
        _id: directoryId ? directoryId : user.root_directory,
        owner: userId,
        in_trash: false,
      })
      .populate({
        path: "subarchives",
        match: { in_trash: false, type: "directory" },
      });
    if (!directory) throw new NotFoundException("Directorio no encontrado");

    if (!directoryId) {
      return [
        {
          key: directory._id,
          label: directory.name,
          icon: "pi pi-folder",
          leaf: directory.subarchives.length === 0,
        },
      ];
    } else {
      const subdirectories = await this.archiveModel
        .find({
          parent_directory: directoryId,
          in_trash: false,
          type: "directory",
        })
        .populate({
          path: "subarchives",
          match: { in_trash: false, type: "directory" },
        });
      return subdirectories.map((subdirectory) => ({
        key: subdirectory._id,
        label: subdirectory.name,
        icon: "pi pi-folder",
        leaf: subdirectory.subarchives.length === 0,
      }));
    }
  }

  async findOneFromUser(folderId: string, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const directory = await this.archiveModel
      .findOne({
        _id: folderId,
        owner: userId,
        in_trash: false,
      })
      .populate({
        path: "subarchives",
        match: { in_trash: false },
        populate: {
          path: "shared_by",
          select: ["username", "name"],
        },
      });
    if (!directory) {
      throw new NotFoundException("Directorio no encontrado");
    }
    return {
      results: directory,
      display_path: await this.getBreadcrumb(folderId),
    };
  }

  async update(
    fileId: string,
    userId: string,
    updateFileDto: UpdateArchiveDto,
  ) {
    const { action } = updateFileDto;
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException("Usuario no encontrado");

    const archive = await this.archiveModel.findOne({
      _id: fileId,
      owner: userId,
      in_trash: false,
    });
    if (!archive) throw new NotFoundException("Archivo no encontrado");

    switch (action) {
      case "duplicate":
      // const newFile = new this.archiveModel({
      //   ...file.toObject(),
      //   _id: undefined,
      //   name: `${file.name} - Copia`,
      // });
      // await newFile.save();
      // return newFile;
      case "move":
        return await this.moveFile(archive, updateFileDto);
      default:
        throw new BadRequestException("Acción no válida");
    }
  }

  private async moveFile(
    file: ArchiveDocument,
    moveArchiveDto: MoveArchiveDto,
  ) {
    const newParent = await this.archiveModel.findOne({
      _id: moveArchiveDto.new_parent_id,
    });

    if (!newParent) {
      throw new NotFoundException("Nuevo directorio no encontrado");
    }

    if (newParent._id.equals(file._id)) {
      throw new BadRequestException(
        "Directorio no puede ser movido a sí mismo",
      );
    }

    await this.archiveModel.updateOne(
      { _id: file.parent_directory },
      { $pull: { subarchives: file._id } },
    );

    await this.archiveModel.updateOne(
      { _id: newParent._id },
      { $push: { subarchives: file._id } },
    );

    const newPath = file.path.split("/").pop();

    await this.archiveModel.updateOne(
      { _id: file._id },
      { parent_directory: newParent._id, path: `${newParent.path}/${newPath}` },
    );
    return file;
  }

  async removeFile(directoryId: string, fileId: string, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const file = await this.archiveModel.findOne({
      type: "file",
      _id: fileId,
      parent_directory: directoryId,
      owner: userId,
      in_trash: false,
    });
    if (!file) {
      throw new NotFoundException("Archivo no encontrado");
    }
    file.in_trash = true;
    await file.save();
    return file;
  }

  async remove(id: string, userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const directory = await this.archiveModel.findOne({
      type: "directory",
      _id: id,
      owner: userId,
      in_trash: false,
    });
    if (!directory) {
      throw new NotFoundException("Directorio no encontrado");
    }
    directory.in_trash = true;
    await directory.save();
    return directory;
  }
}
