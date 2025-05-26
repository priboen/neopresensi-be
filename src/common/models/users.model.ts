import * as bcrypt from 'bcryptjs';
import { BeforeCreate, BeforeUpdate, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Attendance } from './attendances.model';
import { Permission } from './permissions.model';

@Table({tableName: "users", timestamps: true})
export class User extends Model<User>{
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false })
  uuid: string;

  @Column({allowNull: false})
  name: string;

  @Column({ unique: true, allowNull: false })
  username: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  })
  role: 'user' | 'admin';

  @Column({
    type: DataType.BLOB,
    allowNull: true,
  })
  face_embedding: Buffer;

  @HasMany(() => Attendance)
  attendances: Attendance[];

  @HasMany(() => Attendance)
  permissions: Permission[];

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}