import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionStatus } from 'src/common/enums';

export class UpdatePermissionStatusDto {
  @ApiProperty({
    enum: PermissionStatus,
    description: 'New status',
  })
  @IsEnum(PermissionStatus)
  @IsNotEmpty()
  status: PermissionStatus;
}
