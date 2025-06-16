import { ApiProperty } from '@nestjs/swagger';
import { CCTVSchedule } from 'src/common/models';

export class GetCctvScheduleResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'CCTV schedules retrieved successfully' })
  message: string;
  @ApiProperty({
    example: [
      {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        cctv_id: 'cctv-001',
        start_time: '2024-05-01T08:00:00Z',
        end_time: '2024-05-01T10:00:00Z',
        createdAt: '2024-04-30T12:00:00Z',
        updatedAt: '2024-04-30T12:00:00Z',
      },
      {
        uuid: '123e4567-e89b-12d3-a456-426614174001',
        cctv_id: 'cctv-002',
        start_time: '2024-05-01T10:00:00Z',
        end_time: '2024-05-01T12:00:00Z',
        createdAt: '2024-04-30T12:30:00Z',
        updatedAt: '2024-04-30T12:30:00Z',
      },
    ],
  })
  data: CCTVSchedule[];
}

export class CreateCctvScheduleResponse {
  @ApiProperty({ example: 201 })
  statusCode: number;
  @ApiProperty({ example: 'CCTV schedule created successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      cctv_id: 'cctv-001',
      start_time: '2024-05-01T08:00:00Z',
      end_time: '2024-05-01T10:00:00Z',
      createdAt: '2024-04-30T12:00:00Z',
      updatedAt: '2024-04-30T12:00:00Z',
    },
  })
  data: CCTVSchedule;
}

export class UpdateCctvScheduleResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'CCTV schedule updated successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      cctv_id: 'cctv-001',
      start_time: '2024-05-01T08:00:00Z',
      end_time: '2024-05-01T10:00:00Z',
      createdAt: '2024-04-30T12:00:00Z',
      updatedAt: '2024-04-30T12:30:00Z',
    },
  })
  data: CCTVSchedule;
}

export class DeleteCctvScheduleResponse {
  @ApiProperty({ example: 200 })
  statusCode: number;
  @ApiProperty({ example: 'CCTV schedule deleted successfully' })
  message: string;
  @ApiProperty({
    example: {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      cctv_id: 'cctv-001',
      start_time: '2024-05-01T08:00:00Z',
      end_time: '2024-05-01T10:00:00Z',
      createdAt: '2024-04-30T12:00:00Z',
      updatedAt: '2024-04-30T12:00:00Z',
    },
  })
  data?: CCTVSchedule;
}
