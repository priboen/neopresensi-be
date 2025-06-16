import { Module } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { meetingProvider } from 'src/common/providers';

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService, meetingProvider],
})
export class MeetingsModule {}
