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

  @Column({ type: DataType.TIME, allowNull: false })
  check_in: string;

  @Column({ type: DataType.TIME, allowNull: true })
  check_out: string | null;

  @Column({ allowNull: false })
  status: string;

  @BelongsTo(() => CCTVSchedule, { foreignKey: 'cctv_schedule_id' })
  cctvSchedule: CCTVSchedule;

  @BelongsTo(() => User, { foreignKey: 'user_id' })
  user: User;
}
