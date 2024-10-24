import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateArchiveDto {
  @IsNotEmpty({message: "El nombre es requerido"})
  name: string;

  @IsNotEmpty()
  @IsIn(["directory", "file"])
  type: "directory" | "file";

  @IsNotEmpty()
  @IsString()
  parent_directory: string;
}
