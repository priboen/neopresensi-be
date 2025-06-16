import { ApiProperty } from "@nestjs/swagger";

export class CreateSubjectDto {
  @ApiProperty({
    example: "Mathematics",
    description: "The name of the subject",
  })
  name: string;
}