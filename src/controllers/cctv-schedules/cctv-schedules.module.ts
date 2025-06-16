import { Module } from '@nestjs/common';
import { CctvSchedulesService } from './cctv-schedules.service';
import { CctvSchedulesController } from './cctv-schedules.controller';
import { cctvScheduleProvider } from 'src/common/providers';

@Module({
  controllers: [CctvSchedulesController],
  providers: [CctvSchedulesService, cctvScheduleProvider],
})
export class CctvSchedulesModule {}
