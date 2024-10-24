import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { UpdateArchiveDto } from './dto/update-directory.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateArchiveDto } from './dto/create-directory.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArchiveDto: CreateArchiveDto, @Req() req) {
    return this.directoriesService.create(createArchiveDto, req.user.sub);
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post(':id/files')
  upload(@Req() req, @UploadedFile() file: Express.Multer.File, @Param('id') folderId: string) {
    return this.directoriesService.upload(req.user.sub, folderId, file);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.directoriesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('trash')
  findAllTrash(@Req() req) {
    return this.directoriesService.findAllTrash(req.user.sub);
  }

  /* 
  * Route to get all directories of a user
  */
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.directoriesService.findOneFromUser(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchiveDto: UpdateArchiveDto) {
    return this.directoriesService.update(+id, updateArchiveDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.directoriesService.remove(id, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/files/:fileId')
  removeFile(@Param('id') id: string, 
              @Param('fileId') fileId: string,
  @Req() req) {
    return this.directoriesService.removeFile(id,fileId, req.user.sub);
  }
}
