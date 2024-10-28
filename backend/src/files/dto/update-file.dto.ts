import { IntersectionType } from "@nestjs/mapped-types";
import { IsIn, IsNotEmpty, ValidateIf } from "class-validator";

type UpdateFileAction = "duplicate" | "move" | "share";

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

export class UpdateFileDto extends IntersectionType(MoveFileDto, ShareFileDto) {
  @IsNotEmpty()
  @IsIn(["duplicate", "move", "share"])
  action: UpdateFileAction;
}
