import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubjectDto {
  @ApiProperty({
    example: "Mathematics",
    description: "The name of the subject",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}