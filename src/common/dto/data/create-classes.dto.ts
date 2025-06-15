import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateClassesDto {
  @ApiProperty({
    example: 7,
    description:
      'Grade level of the class, e.g., 7 for first grade, 8 for second grade, etc.',
  })
  @IsNumber()
  grade: number;

  @ApiProperty({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Unique identifier for the class group',
  })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;
}
