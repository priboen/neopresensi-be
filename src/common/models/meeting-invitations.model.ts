import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Meeting } from './meetings.model';
import { User } from './user.model';
import { MeetingAttendance } from './meeting-attendances.model';

@Table({ tableName: 'meeting_invitations', timestamps: true })
export class MeetingInvitation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  uuid: string;

  @ForeignKey(() => Meeting)
  @Column({ type: DataType.UUID, allowNull: false })
  meeting_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id: string;

  @BelongsTo(() => Meeting, { foreignKey: 'meeting_id' })
  meeting: Meeting;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;

  @HasMany(() => MeetingAttendance, {
    foreignKey: 'invitation_id',
    onDelete: 'CASCADE',
  })
  meetingAttendances: MeetingAttendance[];
}
