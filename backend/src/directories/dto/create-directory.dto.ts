import { Transform, TransformFnParams } from "class-transformer";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateArchiveDto {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "El nombre debe ser un texto" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @IsNotEmpty()
  @IsIn(["directory", "file"])
  type: "directory" | "file";

  @IsNotEmpty()
  @IsString()
  parent_directory: string;
}
