import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTeacherAssignmentDto {
  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the teacher',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the class',
  })
  @IsUUID()
  @IsNotEmpty()
  class_id: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the subject',
  })
  @IsUUID()
  @IsNotEmpty()
  subject_id: string;
}
