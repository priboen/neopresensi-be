import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AdminAttendanceCreateDto {
  @ApiProperty({
    example: 'user-uuid',
    description: 'UUID of the user who is checking in or out',
  })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    example: 'cctv-schedule-uuid',
    description: 'UUID of the CCTV schedule for attendance',
  })
  @IsUUID()
  @IsNotEmpty()
  cctvScheduleId: string;

  @ApiProperty({
    example: 'present',
    description: 'Status of attendance, e.g., present, absent, late',
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    example: '2023-10-01',
    description: 'Date of attendance in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsString()
  date: Date;

  @ApiProperty({
    example: '07:40:00',
    description: 'Time of attendance in HH:mm:ss format',
  })
  @IsNotEmpty()
  @IsString()
  check_in: string;

  @ApiProperty({
    example: '17:00:00',
    description: 'Time of check-out in HH:mm:ss format',
  })
  @IsNotEmpty()
  @IsString()
  check_out: string;
}
