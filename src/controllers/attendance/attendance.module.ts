import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { attendanceProvider, cctvScheduleProvider } from 'src/common/providers';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, attendanceProvider, cctvScheduleProvider],
})
export class AttendanceModule {}
