import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  ForeignKey,
  Model,
  Default,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { CCTVConfig } from './cctv-configs.model';
import { Attendance } from './attendances.model';

@Table({ tableName: 'cctv_schedule', timestamps: true })
export class CCTVSchedule extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @ForeignKey(() => CCTVConfig)
  @Column({ type: DataType.UUID })
  cctv_id: string;

  @Column({ allowNull: false })
  day: string;

  @Column({ type: DataType.TIME, allowNull: false })
  check_in_time: string;

  @Column({ type: DataType.TIME, allowNull: false })
  check_out_time: string;

  @BelongsTo(() => CCTVConfig, { foreignKey: 'cctv_id' })
  cctvConfig: CCTVConfig;

  @HasMany(() => Attendance, {
    foreignKey: 'cctv_schedule_id',
    onDelete: 'CASCADE',
  })
  attendances: Attendance[];
}
