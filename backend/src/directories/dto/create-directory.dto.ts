import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateArchiveDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsIn(["directory", "file"])
  type: "directory" | "file";

  @IsNotEmpty()
  @IsString()
  parent_directory: string;
}
