import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";

export class UpdateTeacherAssignmentDto {
  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the teacher',
  })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the class',
  })
  @IsUUID()
  @IsOptional()
  class_id?: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the subject',
  })
  @IsUUID()
  @IsOptional()
  subject_id?: string;
}
