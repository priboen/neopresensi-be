import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCctvScheduleDto {
  @ApiProperty({
    example: 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q6',
    description: 'Unique identifier for the CCTV camera',
  })
  @IsOptional()
  @IsUUID()
  cctv_id?: string;

  @ApiProperty({
    example: 'Monday',
    description: 'Day of the week for the schedule',
  })
  @IsOptional()
  @IsString()
  day?: string;

  @ApiProperty({
    example: '08:00',
    description: 'Check-in time for the schedule',
  })
  @IsOptional()
  @IsString()
  check_in_time?: string;

  @ApiProperty({
    example: '17:00',
    description: 'Check-out time for the schedule',
  })
  @IsOptional()
  @IsString()
  check_in_out?: string;
}