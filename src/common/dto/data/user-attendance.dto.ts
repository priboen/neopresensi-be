import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserAttendanceDto {
  @ApiProperty({
    example: '2023-10-01',
    description: 'Date of attendance in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  @IsString()
  date: string;
}
