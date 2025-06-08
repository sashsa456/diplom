import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateFeedbackDto {
  @IsString()
  @ApiProperty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(3, 64)
  @ApiProperty()
  topic: string;

  @IsString()
  @Length(1, 2000)
  @ApiProperty()
  text: string;
}
