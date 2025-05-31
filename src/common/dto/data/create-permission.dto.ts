import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PermissionStatus } from 'src/common/enums';

export class CreatePermissionDto {
  @ApiProperty({
    example: '2024-05-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({ example: '2024-05-03', description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  end_date: string;

  @ApiProperty({ example: 'Medical leave', description: 'Reason for permission' })
  @IsString()
  reason: string;

  @ApiPropertyOptional({ enum: PermissionStatus, description: 'Status' })
  @IsEnum(PermissionStatus)
  @IsOptional()
  status?: PermissionStatus;
}
