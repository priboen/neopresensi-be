import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateScheduleDto {
  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the class',
  })
  @IsString()
  @IsOptional()
  day?: string;

  @ApiProperty({
    example: '07:40',
    description: 'The start time of the class in HH:mm format',
  })
  @IsString()
  @IsOptional()
  start_time?: string;

  @ApiProperty({
    example: '08:30',
    description: 'The end time of the class in HH:mm format',
  })
  @IsString()
  @IsOptional()
  end_time?: string;

  @ApiProperty({
    example: '9ae92359-2500-4cb7-977b-db148db9ffda',
    description: 'The unique identifier of the class',
  })
  @IsUUID()
  @IsOptional()
  teacher_id?: string;
}
