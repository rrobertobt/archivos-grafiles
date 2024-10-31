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

export class CreateFileInDirectoryDto {
  @IsNotEmpty({ message: "El nombre es requerido" })
  @IsString({ message: "El nombre debe ser un texto" })
  @Transform(({ value }: TransformFnParams) =>
    value
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim(),
  )
  name: string;

  @IsNotEmpty({ message: "La extensión es requerida" })
  @IsString({ message: "La extensión debe ser un texto" })
  @IsIn(["txt", "html"], { message: "La extensión debe ser 'txt' o 'html'" })
  extension: "txt" | "html";

  @IsString({ message: "El contenido debe ser un texto" })
  content: string;
}

export const extensionMimeTypeMap = {
  txt: "text/plain",
  html: "text/html",
};
