import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateMeetingInvitationDto {
  @ApiProperty({ example: 'meeting-uuid' })
  @IsUUID()
  meeting_id: string;

  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  user_id: string;
}
