import { Module } from '@nestjs/common';
import { TeacherAssignmentsService } from './teacher-assignments.service';
import { TeacherAssignmentsController } from './teacher-assignments.controller';
import { teacherAssignmentProvider } from 'src/common/providers';

@Module({
  controllers: [TeacherAssignmentsController],
  providers: [TeacherAssignmentsService, teacherAssignmentProvider],
})
export class TeacherAssignmentsModule {}
