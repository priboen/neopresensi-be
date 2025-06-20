import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './controllers/auth/auth.module';
import { MysqlModule } from './common/modules';
import { UsersModule } from './controllers/users/users.module';
import { PermissionsModule } from './controllers/permissions/permissions.module';
import { FileUploadModule } from './controllers/file-upload/file-upload.module';
import { FaceEmbeddingModule } from './controllers/face-embedding/face-embedding.module';
import { ClassesModule } from './controllers/classes/classes.module';
import { ClassGroupModule } from './controllers/class-group/class-group.module';
import { CctvConfigsModule } from './controllers/cctv-configs/cctv-configs.module';
import { CctvSchedulesModule } from './controllers/cctv-schedules/cctv-schedules.module';
import { MeetingsModule } from './controllers/meetings/meetings.module';
import { MeetingInvitationsModule } from './controllers/meeting-invitations/meeting-invitations.module';
import { SubjectsModule } from './controllers/subjects/subjects.module';
import { TeacherAssignmentsModule } from './controllers/teacher-assignments/teacher-assignments.module';
import { SchedulesModule } from './controllers/schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MysqlModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    FileUploadModule,
    FaceEmbeddingModule,
    ClassesModule,
    ClassGroupModule,
    CctvConfigsModule,
    CctvSchedulesModule,
    MeetingsModule,
    MeetingInvitationsModule,
    SubjectsModule,
    TeacherAssignmentsModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
