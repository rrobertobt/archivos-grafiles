import { IntersectionType } from "@nestjs/mapped-types";
import { IsIn, IsNotEmpty } from "class-validator";

type UpdateFileAction = "duplicate" | "move";

export class MoveFileDto {
  @IsNotEmpty()
  new_parent_id: string;
}

export class UpdateFileDto extends IntersectionType(MoveFileDto) {
  @IsNotEmpty()
  @IsIn(["duplicate", "move"])
  action: UpdateFileAction;
}
