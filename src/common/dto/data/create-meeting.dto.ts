import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({
    example: 'Team Sync',
    description: 'The title of the meeting',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Discuss project updates and next steps',
    description: 'A brief description of the meeting',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '2023-10-01',
    description: 'The date of the meeting',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    example: '10:00',
    description: 'The start time of the meeting in HH:mm format',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  start_time: string;

  @ApiProperty({
    example: '11:00',
    description: 'The end time of the meeting in HH:mm format',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  end_time: string;
}
