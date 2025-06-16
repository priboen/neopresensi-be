import { ApiProperty } from '@nestjs/swagger';
import { Meeting } from 'src/common/models';

export class GetMeetingResponseDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Meeting retrieved successfully',
  })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Weekly Team Sync',
      description: 'Discuss project updates and next steps',
      date: new Date('2023-10-01'),
      start_time: '10:00',
      end_time: '11:00',
      total_invited: 10,
      total_present: 8,
      total_absent: 2,
    },
  })
  data: {
    uuid: string;
    title: string;
    description: string;
    date: Date;
    start_time: string;
    end_time: string;
    total_invited: number;
    total_present: number;
    total_absent: number;
  };
}

export class CreateMeetingResponseDto {
  @ApiProperty({
    example: 201,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Meeting created successfully',
  })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Weekly Team Sync',
      description: 'Discuss project updates and next steps',
      date: new Date('2023-10-01'),
      start_time: '10:00',
      end_time: '11:00',
    },
  })
  data: Meeting;
}

export class UpdateMeetingResponseDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Meeting updated successfully',
  })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Weekly Team Sync',
      description: 'Discuss project updates and next steps',
      date: new Date('2023-10-01'),
      start_time: '10:00',
      end_time: '11:00',
    },
  })
  data: Meeting;
}

export class DeleteMeetingResponseDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Meeting deleted successfully',
  })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Weekly Team Sync',
      description: 'Discuss project updates and next steps',
      date: new Date('2023-10-01'),
      start_time: '10:00',
      end_time: '11:00',
    },
  })
  data?: Meeting;
}