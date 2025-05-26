import { BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ tableName: "permissions", timestamps: true })
export class Permission extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  user_uuid: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  start_date: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  end_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @BelongsTo(() => User)
  user: User;
}