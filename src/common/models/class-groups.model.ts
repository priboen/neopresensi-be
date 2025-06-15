import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Classes } from './classes.model';

@Table({ tableName: 'class_groups', timestamps: true })
export class ClassGroup extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false, unique: true })
  name: string;

  @HasMany(() => Classes, { foreignKey: 'group_id', onDelete: 'SET NULL' })
  classes: Classes[];
}
