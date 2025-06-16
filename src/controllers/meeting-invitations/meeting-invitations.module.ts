import { Module } from '@nestjs/common';
import { MeetingInvitationsService } from './meeting-invitations.service';
import { MeetingInvitationsController } from './meeting-invitations.controller';
import { meetingInvitationProvider } from 'src/common/providers';

@Module({
  controllers: [MeetingInvitationsController],
  providers: [MeetingInvitationsService, meetingInvitationProvider],
})
export class MeetingInvitationsModule {}
