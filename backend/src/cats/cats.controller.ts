import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request } from 'express';
// import { Multer } from 'multer';


@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createCatDto: CreateCatDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.catsService.create(createCatDto, file);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.catsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
  //   return this.catsService.update(+id, updateCatDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.catsService.remove(+id);
  // }
}
