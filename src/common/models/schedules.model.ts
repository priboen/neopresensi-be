import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  ForeignKey,
  Default,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Classes } from './classes.model';
import { Subject } from './subjects.model';
import { User } from './user.model';

@Table({ tableName: 'schedules', timestamps: true })
export class Schedule extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  day: string;

  @Column({ allowNull: false })
  start_time: string;

  @Column({ allowNull: false })
  end_time: string;

  @ForeignKey(() => Classes)
  @Column({ type: DataType.UUID })
  class_id: string;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID })
  subject_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @BelongsTo(() => Classes)
  classes: Classes;

  @BelongsTo(() => Subject)
  subject: Subject;

  @BelongsTo(() => User)
  user: User;
}
