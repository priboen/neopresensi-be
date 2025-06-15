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
import { CCTVSchedule } from './cctv-schedules.model';

@Table({ tableName: 'cctv_configs', timestamps: true })
export class CCTVConfig extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  rtsp_url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  username: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string | null;

  @HasMany(() => CCTVSchedule, { foreignKey: 'cctv_id', onDelete: 'CASCADE' })
  cctvSchedules: CCTVSchedule[];
}
