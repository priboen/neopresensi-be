import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ tableName: "attendances", timestamps: true })
export class Attendance extends Model{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_uuid: string;

  @Column({ type: DataType.TIME, allowNull: false })
  check_in: string;

  @Column({ type: DataType.TIME, allowNull: true})
  check_out!: string;

  @Column({
    type: DataType.ENUM('present', 'late', 'absent'),
    allowNull: false,
    defaultValue: 'present',
  })
  status: 'present' | 'late' | 'absent';

  @BelongsTo(() => User)
  user: User;
}