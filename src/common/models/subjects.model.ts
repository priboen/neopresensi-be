import {
  BelongsTo,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TeacherAssignment } from './teacher-assignments.model';

@Table({ tableName: 'subjects', timestamps: true })
export class Subject extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false, unique: true })
  name: string;

  @HasMany(() => TeacherAssignment, {
    foreignKey: 'subject_id',
    onDelete: 'CASCADE',
  })
  teacherAssignments: TeacherAssignment[];
}
