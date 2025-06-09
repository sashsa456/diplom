import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @Length(3, 2000)
  @ApiProperty()
  message: string;

  userId: number;
  reviewId: number;
}
