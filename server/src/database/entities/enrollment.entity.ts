import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Courses } from './course.entity';

@Table
export class Enrollments extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  enrollment_id: bigint;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  student_id: bigint;

  @ForeignKey(() => Courses)
  @Column({ type: DataType.BIGINT })
  course_id: bigint;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  payed_for: boolean;

  @BelongsTo(() => Users)
  student: Users;

  @BelongsTo(() => Courses)
  course: Courses;
}
