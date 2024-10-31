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
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @UseGuards(AuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string, @Req() request) {
    return this.filesService.findOne(id, request.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFileDto: UpdateFileDto,
    @Req() request,
  ) {
    return this.filesService.update(id, request.user.sub, updateFileDto);
  }

  @UseInterceptors(FileInterceptor("file"))
  @UseGuards(AuthGuard)
  @Patch(":id/upload")
  updateFileImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ) {
    return this.filesService.updateFile(id, request.user.sub, file);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(+id);
  }
}
