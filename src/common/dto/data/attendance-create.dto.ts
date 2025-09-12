import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AttendanceCreateDto {
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
    example: '07:40:00',
    description: 'Time of attendance in HH:mm:ss format',
  })
  @IsNotEmpty()
  @IsString()
  time: string;
}
