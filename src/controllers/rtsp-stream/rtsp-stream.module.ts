import { Module } from '@nestjs/common';
import { RtspStreamService } from './rtsp-stream.service';
import { RtspStreamController } from './rtsp-stream.controller';

@Module({
  controllers: [RtspStreamController],
  providers: [RtspStreamService],
})
export class RtspStreamModule {}
