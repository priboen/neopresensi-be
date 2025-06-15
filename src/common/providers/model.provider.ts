import {
  Attendance,
  CCTVConfig,
  CCTVSchedule,
  Classes,
  ClassGroup,
  Meeting,
  MeetingAttendance,
  MeetingInvitation,
  Permission,
  Schedule,
  Subject,
  TeacherAssignment,
  User,
} from '../models';

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};

export const classGroupProvider = {
  provide: 'CLASS_GROUP_REPOSITORY',
  useValue: ClassGroup,
};

export const classProvider = {
  provide: 'CLASS_REPOSITORY',
  useValue: Classes,
};

export const subjectProvider = {
  provide: 'SUBJECT_REPOSITORY',
  useValue: Subject,
};

export const teacherAssignmentProvider = {
  provide: 'TEACHER_ASSIGNMENT_REPOSITORY',
  useValue: TeacherAssignment,
};

export const scheduleProvider = {
  provide: 'SCHEDULE_REPOSITORY',
  useValue: Schedule,
};

export const cctvConfigProvider = {
  provide: 'CCTV_CONFIG_REPOSITORY',
  useValue: CCTVConfig,
};

export const cctvScheduleProvider = {
  provide: 'CCTV_SCHEDULE_REPOSITORY',
  useValue: CCTVSchedule,
};

export const attendanceProvider = {
  provide: 'ATTENDANCE_REPOSITORY',
  useValue: Attendance,
};

export const meetingProvider = {
  provide: 'MEETING_REPOSITORY',
  useValue: Meeting,
};

export const meetingAttendanceProvider = {
  provide: 'MEETING_ATTENDANCE_REPOSITORY',
  useValue: MeetingAttendance,
};

export const permissionProvider = {
  provide: 'PERMISSION_REPOSITORY',
  useValue: Permission,
};

export const meetingInvitationProvider = {
  provide: 'MEETING_INVITATION_REPOSITORY',
  useValue: MeetingInvitation,
};

export const modelProviders = [
  userProvider,
  classGroupProvider,
  classProvider,
  subjectProvider,
  teacherAssignmentProvider,
  scheduleProvider,
  cctvConfigProvider,
  cctvScheduleProvider,
  attendanceProvider,
  meetingProvider,
  meetingAttendanceProvider,
  permissionProvider,
  meetingInvitationProvider,
];
