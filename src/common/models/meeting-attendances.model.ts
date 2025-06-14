import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Meeting } from './meetings.model';
import { User } from './user.model';

@Table({ tableName: 'meeting_attendances', timestamps: true })
export class MeetingAttendance extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @ForeignKey(() => Meeting)
  @Column({ type: DataType.UUID })
  meeting_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @Column({ type: DataType.DATE, allowNull: false })
  attendance_time: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  qr_token: string;

  @BelongsTo(() => Meeting, { onDelete: 'CASCADE' })
  meeting: Meeting;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
