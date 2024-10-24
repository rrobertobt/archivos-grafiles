import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { UpdateArchiveDto } from './dto/update-directory.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateArchiveDto } from './dto/create-directory.dto';

@Controller('directories')
export class DirectoriesController {
  constructor(private readonly directoriesService: DirectoriesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createArchiveDto: CreateArchiveDto, @Req() req) {
    return this.directoriesService.create(createArchiveDto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.directoriesService.findAll();
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directoriesService.remove(+id);
  }
}
