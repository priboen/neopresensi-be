import { Attendance, Permission, User } from "../models";

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User
};
export const attendanceProvider = {
  provide: 'ATTENDANCE_REPOSITORY',
  useValue: Attendance
};
export const PermissionProvider = {
  provide: 'PERMISSION_REPOSITORY',
  useValue: Permission
};