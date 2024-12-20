import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import {
  ContentFileDto,
  MoveFileDto,
  ShareFileDto,
  UpdateFileDto,
} from "./dto/update-file.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Connection, Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import { File, FileDocument } from "src/directories/entities/file.entity";
import {
  Archive,
  ArchiveDocument,
} from "src/directories/entities/directory.entity";
import { UserDocument } from "src/auth/entities/user.entity";

@Injectable()
export class FilesService {
  private readonly fileBucket: GridFSBucket;
  constructor(
    @InjectModel(File.name) private fileModel: Model<File>,
    @InjectModel(Archive.name) private archiveModel: Model<Archive>,
    @InjectConnection() private connection: Connection,
    private usersService: UsersService,
  ) {
    this.fileBucket = new GridFSBucket(this.connection.db, {
      bucketName: "uploads",
    });
  }
  create(createFileDto: CreateFileDto) {
    return "This action adds a new file";
  }

  async findOne(fileId: string, userId: string) {
    if (!ObjectId.isValid(fileId)) {
      throw new BadRequestException("ID de archivo inválido");
    }
    const file = await this.archiveModel.findOne({
      _id: fileId,
      owner: userId,
    });
    if (!file) throw new NotFoundException("Archivo no existe");
    const fileDocument = await this.fileModel.findOne({
      _id: file.file,
    });

    // if the file is an image, we can return the image as base64
    const fileStream = this.fileBucket.openDownloadStream(fileDocument._id);
    if (file.mime_type.includes("image")) {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        fileStream.on("data", (chunk) => {
          chunks.push(chunk);
        });

        fileStream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const base64Image = buffer.toString("base64");
          resolve({
            file: file,
            content: `data:${file.mime_type};base64,${base64Image}`,
          });
        });

        fileStream.on("error", (error) => {
          reject(error);
        });
      });
    } else if (file.mime_type.includes("text")) {
      // if the file is a text file, we can return the text as a string
      return new Promise((resolve, reject) => {
        let text = "";
        fileStream.on("data", (chunk) => {
          text += chunk.toString();
        });

        fileStream.on("end", () => {
          resolve({
            file: file,
            content: text,
          });
        });

        fileStream.on("error", (error) => {
          reject(error);
        });
      });
    }
    return null;
  }

  async update(fileId: string, userId: string, updateFileDto: UpdateFileDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const file = await this.archiveModel.findOne({
      _id: fileId,
      owner: userId,
      in_trash: false,
    });
    if (!file) {
      throw new NotFoundException("Archivo no encontrado");
    }

    const { action } = updateFileDto;
    switch (action) {
      case "duplicate":
        return await this.duplicateFile(fileId);
      case "move":
        return await this.moveFile(file, updateFileDto);
      case "share":
        return await this.shareFile(file, updateFileDto);
      case "content":
        return await this.updatePlainContent(file, updateFileDto);
      default:
        throw new NotFoundException("Acción no encontrada");
    }
  }

  async updateFile(
    fileId: string,
    userId: string,
    newFile: Express.Multer.File,
  ) {
    if (!newFile) {
      throw new BadRequestException("Archivo a subir no encontrado");
    }
    const allowedTypes = ["text/plain", "image/png", "image/jpeg", "text/html"];
    if (!allowedTypes.includes(newFile.mimetype)) {
      throw new BadRequestException("Tipo de archivo no permitido");
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }
    const file = await this.archiveModel.findOne({
      _id: fileId,
      owner: userId,
      in_trash: false,
    });
    if (!file) {
      throw new NotFoundException("Archivo no encontrado");
    }

    // also check if file with same name exists
    const existingFile = await this.archiveModel.findOne({
      name: newFile.originalname,
      parent_directory: file.parent_directory,
      in_trash: false,
    });
    if (existingFile && existingFile.name !== file.name) {
      throw new BadRequestException(
        "Archivo con el mismo nombre ya existe en este directorio",
      );
    }

    const fileDocument = await this.fileModel.findOne({
      _id: file.file,
    });

    // Delete the old file stream
    await this.fileBucket.delete(fileDocument._id);

    const uploadStream = this.fileBucket.openUploadStream(newFile.originalname);
    uploadStream.end(newFile.buffer);

    const pathSegments = file.path.split("/");
    pathSegments.pop();
    const path = `${pathSegments.join("/")}/${newFile.originalname}`;

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", async () => {
        await this.archiveModel.updateOne(
          { _id: file._id },
          {
            name: newFile.originalname,
            file: uploadStream.id,
            mime_type: newFile.mimetype,
            path,
          },
        );
        resolve();
      });
      uploadStream.on("error", reject);
    });

    return await this.findOne(fileId, userId);
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }

  private async updatePlainContent(
    file: ArchiveDocument,
    contentFileDto: ContentFileDto,
  ) {
    // Check if the file is a text file using the mime type
    if (!file.mime_type.includes("text")) {
      throw new BadRequestException("El archivo no es un archivo de texto");
    }

    const fileDocument = await this.fileModel.findOne({
      _id: file.file,
    });

    // return fileDocument.filename;

    // Create a new file stream and save the new content
    const fileStream = this.fileBucket.openUploadStream(fileDocument.filename);
    fileStream.end(contentFileDto.content);

    // Delete the old file stream
    await this.fileBucket.delete(fileDocument._id);

    // Update the file reference in the archive
    await this.archiveModel.updateOne(
      { _id: file._id },
      { file: fileStream.id },
    );

    const owner = file.owner as UserDocument;
    return await this.findOne(file._id.toString(), owner._id.toString());
  }

  private async moveFile(file: ArchiveDocument, moveFileDto: MoveFileDto) {
    const newParent = await this.archiveModel.findOne({
      _id: moveFileDto.new_parent_id,
      type: "directory",
      shared: false,
    });

    if (!newParent) {
      throw new NotFoundException("Nuevo directorio no encontrado");
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
  private async duplicateFile(fileId: string) {
    const file = await this.archiveModel
      .findOne({
        _id: fileId,
        in_trash: false,
      })
      .populate({
        path: "file",
      });

    const parent_directory = await this.archiveModel.findOne({
      _id: file.parent_directory,
    });

    const gridFsFile = file.file as FileDocument;

    let newFileName = file.name + " - Copia";
    let copyIndex = 1;

    // Check if a file with the same name already exists and increment the copy index
    while (
      await this.archiveModel.findOne({
        name: newFileName,
        parent_directory: file.parent_directory,
      })
    ) {
      copyIndex++;
      newFileName = `${file.name} - Copia ${copyIndex}`;
    }

    const newFile = new this.archiveModel({
      name: newFileName,
      owner: file.owner,
      file: file.file,
      mime_type: file.mime_type,
      parent_directory: file.parent_directory,
      path: `${file.path} - Copia${copyIndex > 1 ? ` ${copyIndex}` : ""}`,
      type: file.type,
    });

    const fileReadStream = this.fileBucket.openDownloadStream(gridFsFile._id);
    const uploadStream = this.fileBucket.openUploadStream(newFile.name);
    fileReadStream.pipe(uploadStream);

    await newFile.save();
    parent_directory.subarchives.push(newFile);
    await parent_directory.save();
    return newFile;
  }
  private async shareFile(file: ArchiveDocument, shareFileDto: ShareFileDto) {
    const user = await this.usersService.findByUsername(shareFileDto.username);

    if (!user) {
      throw new NotFoundException("Usuario a compartir no encontrado");
    }

    const fileOwner = file.owner as UserDocument;

    if (user._id.toString() === fileOwner._id.toString()) {
      throw new BadRequestException(
        "No puedes compartir un archivo contigo mismo",
      );
    }

    const sharedFile = await this.archiveModel.create({
      name: file.name,
      owner: user._id,
      file: file.file,
      mime_type: file.mime_type,
      shared: true,
      in_trash: false,
      type: file.type,
      path: `${user.shared_directory.path}/${file.name}`,
      parent_directory: user.shared_directory,
      shared_by: file.owner,
      shared_at: new Date(),
    });

    await this.archiveModel.updateOne(
      {
        _id: user.shared_directory,
      },
      {
        $push: {
          subarchives: sharedFile,
        },
      },
    );

    const gridFsFile = file.file as FileDocument;
    const fileReadStream = this.fileBucket.openDownloadStream(gridFsFile._id);
    const uploadStream = this.fileBucket.openUploadStream(sharedFile.name);
    fileReadStream.pipe(uploadStream);

    return sharedFile;
  }
}
