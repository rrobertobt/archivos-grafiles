import { IntersectionType } from "@nestjs/mapped-types";
import { IsIn, IsNotEmpty, ValidateIf } from "class-validator";

type UpdateFileAction = "duplicate" | "move" | "share" | "content";

export class MoveFileDto {
  @IsNotEmpty()
  @ValidateIf((dto) => dto.action === "move")
  new_parent_id: string;
}

export class ShareFileDto {
  @IsNotEmpty()
  @ValidateIf((dto) => dto.action === "share")
  // user_id: string;
  username: string;
}

export class ContentFileDto {
  @IsNotEmpty()
  @ValidateIf((dto) => dto.action === "content")
  content: string;
}

export class UpdateFileDto extends IntersectionType(
  MoveFileDto,
  ShareFileDto,
  ContentFileDto,
) {
  @IsNotEmpty()
  @IsIn(["duplicate", "move", "share", "content"])
  action: UpdateFileAction;
}
