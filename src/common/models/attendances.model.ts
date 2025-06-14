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
import { User } from './user.model';
import { CCTVSchedule } from './cctv-schedules.model';
import { CCTVConfig } from './cctv-configs.model';

@Table({ tableName: 'attendances', timestamps: true })
export class Attendance extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  uuid: string;

  @ForeignKey(() => CCTVSchedule)
  @Column({ type: DataType.UUID })
  cctv_schedule_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_id: string;

  @Column({ allowNull: false })
  attendance_time: Date;

  @Column({ allowNull: false })
  status: string;

  @ForeignKey(() => CCTVConfig)
  @Column({ type: DataType.UUID })
  cctv_id: string;

  @BelongsTo(() => CCTVSchedule)
  cctvSchedule: CCTVSchedule;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => CCTVConfig)
  cctvConfig: CCTVConfig;
}
