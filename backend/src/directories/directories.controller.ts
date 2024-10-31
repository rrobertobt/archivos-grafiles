import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { DirectoriesService } from "./directories.service";
import { UpdateArchiveDto } from "./dto/update-directory.dto";
import { AuthGuard } from "src/auth/auth.guard";
import {
  CreateArchiveDto,
  CreateFileInDirectoryDto,
} from "./dto/create-directory.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("directories")
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArchiveDto: CreateArchiveDto, @Req() req) {
    return this.directoriesService.create(createArchiveDto, req.user.sub);
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  @Post(":id/files")
  upload(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Param("id") folderId: string,
  ) {
    return this.directoriesService.upload(req.user.sub, folderId, file);
  }

  @UseGuards(AuthGuard)
  @Post(":id/files/content")
  createFile(
    @Req() req,
    @Param("id") folderId: string,
    @Body() createFileInDirectoryDto: CreateFileInDirectoryDto,
  ) {
    return this.directoriesService.createFile(
      req.user.sub,
      folderId,
      createFileInDirectoryDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get(["folders", "folders/:id"])
  findOnlyDirectories(@Req() req, @Param("id") id: string) {
    return this.directoriesService.findOnlyFolders(req.user.sub, id);
  }

  @UseGuards(AuthGuard)
  @Get("trash")
  findAllTrash(@Req() req) {
    return this.directoriesService.findAllTrash(req.user.sub);
  }

  /*
   * Route to get all directories of a user
   */
  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string, @Req() req) {
    return this.directoriesService.findOneFromUser(id, req.user.sub);
  }

  // @UseGuards(AuthGuard)
  // @Patch(":id")
  // duplicate(@Param("id") id: string, @Req() req) {
  //   return this.directoriesService.duplicateDirectory(id, req.user.sub);
  // }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateArchiveDto: UpdateArchiveDto,
    @Req() request,
  ) {
    return this.directoriesService.update(
      id,
      request.user.sub,
      updateArchiveDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req) {
    return this.directoriesService.remove(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(":id/files/:fileId")
  removeFile(
    @Param("id") id: string,
    @Param("fileId") fileId: string,
    @Req() req,
  ) {
    return this.directoriesService.removeFile(id, fileId, req.user.sub);
  }
}
