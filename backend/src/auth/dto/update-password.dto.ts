import { IsNotEmpty } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty({ message: "La nueva contraseña no puede estar vacía" })
  password: string;
}
