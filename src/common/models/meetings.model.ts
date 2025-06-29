import {
  BelongsTo,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { MeetingInvitation } from './meeting-invitations.model';

@Table({ tableName: 'meetings', timestamps: true })
export class Meeting extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: Date;

  @Column({ type: DataType.TIME, allowNull: false })
  start_time: string;

  @Column({ type: DataType.TIME, allowNull: false })
  end_time: string;

  @HasMany(() => MeetingInvitation, {
    foreignKey: 'meeting_id',
    onDelete: 'CASCADE',
  })
  meetingInvitations: MeetingInvitation[];
}
