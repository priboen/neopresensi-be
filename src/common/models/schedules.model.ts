import {
  Column,
  DataType,
  PrimaryKey,
  Table,
  ForeignKey,
  Default,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { TeacherAssignment } from './teacher-assignments.model';

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

  @ForeignKey(() => TeacherAssignment)
  @Column({ type: DataType.UUID, allowNull: false })
  teacher_id: string;

  @BelongsTo(() => TeacherAssignment, {
    foreignKey: 'teacher_id',
    onDelete: 'CASCADE',
  })
  teacherAssignment: TeacherAssignment;
}
