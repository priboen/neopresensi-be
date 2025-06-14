import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  ForeignKey,
  Model,
  Default,
} from 'sequelize-typescript';
import { CCTVConfig } from './cctv-configs.model';

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
}
