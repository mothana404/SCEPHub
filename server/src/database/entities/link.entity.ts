import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Students } from './student.entity';
import { Instructors } from './instructor.entity';

@Table
export class Links extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  link_id: bigint;

  @Column({ type: DataType.STRING, allowNull: false })
  link_name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  link: string;

  @ForeignKey(() => Students)
  @ForeignKey(() => Instructors)
  @Column({ type: DataType.BIGINT })
  user_link: bigint;

  @ForeignKey(() => Instructors)
  @Column({ type: DataType.BIGINT })
  instructor_link: bigint;

  @BelongsTo(() => Students)
  student: Students;

  @BelongsTo(() => Instructors)
  instructors: Instructors;
}
