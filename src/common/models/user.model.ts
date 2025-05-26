import { Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Attendance } from './attendances.model';
import { Permission } from './permissions.model';

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true})
  email: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM('guru', 'admin'),
    allowNull: false,
    defaultValue: 'guru',
  })
  role: 'guru' | 'admin';

  @Column({ type: DataType.TEXT, allowNull: true })
  face_embedding: string | null;

  @HasMany(() => Attendance, {onDelete: 'CASCADE'})
  attendances: Attendance[];

  @HasMany(() => Permission, {onDelete: 'CASCADE'})
  permissions: Permission[];
}
