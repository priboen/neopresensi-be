import {
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
  HasMany,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Attendance } from './attendances.model';
import { TeacherAssignment } from './teacher-assignments.model';
import { MeetingAttendance } from './meeting-attendances.model';
import { Permission } from './permissions.model';
import { MeetingInvitation } from './meeting-invitations.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ unique: true, allowNull: false })
  username: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  face_embedding: string | null;

  @Column({
    type: DataType.ENUM('admin', 'teacher'),
    allowNull: false,
    defaultValue: 'teacher',
  })
  role: 'admin' | 'teacher';

  @Column({ type: DataType.STRING, allowNull: true })
  photo_url: string | null;

  @HasMany(() => Attendance, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  attendances: Attendance[];

  @HasMany(() => TeacherAssignment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  teacherAssignments: TeacherAssignment[];

  @HasMany(() => MeetingInvitation, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  })
  meetingInvitations: MeetingInvitation[];

  @HasMany(() => Permission, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  permissions: Permission[];
}
