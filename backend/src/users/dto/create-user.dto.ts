import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsIn(["admin", "employee"])
  readonly role: "admin" | "employee";
}
