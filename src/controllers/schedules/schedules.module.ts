import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { scheduleProvider, teacherAssignmentProvider } from 'src/common/providers';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService, scheduleProvider, teacherAssignmentProvider],
})
export class SchedulesModule {}
