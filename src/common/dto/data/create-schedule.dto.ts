import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateScheduleDto {
  @ApiProperty({
    example: 'Monday',
    description: 'The day of the week for the class',
  })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({
    example: '07:40',
    description: 'The start time of the class in HH:mm format',
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    example: '08:30',
    description: 'The end time of the class in HH:mm format',
  })
  @IsString()
  @IsNotEmpty()
  end_time: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the class',
  })
  @IsUUID()
  @IsNotEmpty()
  teacher_id: string;
}