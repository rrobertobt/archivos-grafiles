import { Injectable, NotFoundException, Res } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import {
  MoveFileDto,
  ShareFileDto,
  UpdateFileDto,
} from "./dto/update-file.dto";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Connection, Model } from "mongoose";
import { UsersService } from "src/users/users.service";
import { FileDocument } from "src/directories/entities/file.entity";
import {
  Archive,
  ArchiveDocument,
} from "src/directories/entities/directory.entity";
import { Response } from "express";

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

  findAll() {
    return `This action returns all files`;
  }

  async findOne(fileId: string, userId: string) {
    // since this backend only accepts, plain text (txt and html) and imaages (png, jpg, jpeg),
    // we can safely assume that the file is an image or a text file
    // and return the file as a stream
    // return this.fileBucket.openDownloadStream(new ObjectId(fileId));
    const file = await this.archiveModel.findOne({
      _id: fileId,
    });
    console.log(fileId);
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

    // const {} = this.fileBucket.openDownloadStream(fileDocument._id).pipe(res);

    // return new Buffer(fileStream.readable);
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
      default:
        throw new NotFoundException("Acción no encontrada");
    }
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
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
