import { PartialType } from '@nestjs/mapped-types';
import { CreateArchiveDto } from './create-directory.dto';

export class UpdateArchiveDto extends PartialType(CreateArchiveDto) {}
