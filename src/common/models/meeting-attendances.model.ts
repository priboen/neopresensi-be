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
import { MeetingInvitation } from './meeting-invitations.model';

@Table({ tableName: 'meeting_attendances', timestamps: true })
export class MeetingAttendance extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @ForeignKey(() => MeetingInvitation)
  @Column({ type: DataType.UUID })
  invitation_id: string;

  @Column({ type: DataType.TIME, allowNull: false })
  check_in: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  qr_token: string;

  @BelongsTo(() => MeetingInvitation, {
    foreignKey: 'invitation_id',
    onDelete: 'CASCADE',
  })
  meetingInvitation: MeetingInvitation;
}
