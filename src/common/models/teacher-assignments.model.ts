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
import { Classes } from './classes.model';
import { Subject } from './subjects.model';
import { User } from './user.model';
import { Schedule } from './schedules.model';

@Table({ tableName: 'teacher_assignments', timestamps: true })
export class TeacherAssignment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @ForeignKey(() => Classes)
  @Column({ type: DataType.UUID })
  class_id: string;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID })
  subject_id: string;

  @BelongsTo(() => User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  user: User;

  @BelongsTo(() => Classes, { foreignKey: 'class_id', onDelete: 'CASCADE' })
  classes: Classes;

  @BelongsTo(() => Subject, { foreignKey: 'subject_id', onDelete: 'CASCADE' })
  subject: Subject;

  @HasMany(() => Schedule, { foreignKey: 'teacher_id', onDelete: 'CASCADE' })
  schedules: Schedule[];
}
