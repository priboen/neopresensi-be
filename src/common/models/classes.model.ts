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
import { ClassGroup } from './class-groups.model';
import { TeacherAssignment } from './teacher-assignments.model';

@Table({ tableName: 'classes', timestamps: true })
export class Classes extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  uuid: string;

  @Column({ allowNull: false })
  grade: number;

  @ForeignKey(() => ClassGroup)
  @Column({ type: DataType.UUID })
  group_id: string;

  @BelongsTo(() => ClassGroup, { foreignKey: 'group_id', onDelete: 'SET NULL' })
  group: ClassGroup;

  @HasMany(() => TeacherAssignment, {
    foreignKey: 'class_id',
    onDelete: 'CASCADE',
  })
  teacherAssignments: TeacherAssignment[];
}
