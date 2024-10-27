import { IntersectionType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsIn } from "class-validator";

type UpdateArchiveAction = "duplicate" | "move";

export class MoveArchiveDto {
  @IsNotEmpty()
  new_parent_id: string;
}

export class UpdateArchiveDto extends IntersectionType(MoveArchiveDto) {
  @IsNotEmpty()
  @IsIn(["duplicate", "move"])
  action: UpdateArchiveAction;
}
