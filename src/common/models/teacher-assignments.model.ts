import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  ForeignKey,
  Model,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { Classes } from './classes.model';
import { Subject } from './subjects.model';
import { User } from './user.model';

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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Classes)
  classes: Classes;

  @BelongsTo(() => Subject)
  subject: Subject;
}
