import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Categories } from './category.entity';
import { Contents } from './course-videos.entity';
import { Instructors } from './instructor.entity';

@Table
export class Courses extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  course_id: bigint;

  @Column(DataType.STRING)
  course_name: string;

  @Column(DataType.STRING)
  course_description: string;

  @ForeignKey(() => Instructors)
  @Column({ type: DataType.BIGINT })
  course_instructor: bigint;

  @Column({ type: DataType.TEXT, defaultValue: null })
  course_img: string;

  @Column({ type: DataType.DECIMAL(10, 1), defaultValue: 0 })
  rating: number;

  @Column({ type: DataType.STRING, defaultValue: null })
  course_comments: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_deleted: boolean;

  @ForeignKey(() => Categories)
  @Column({ type: DataType.BIGINT })
  course_category: bigint;

  @BelongsTo(() => Instructors, { foreignKey: 'course_instructor' })
  instructor: Instructors;

  @BelongsTo(() => Categories, 'course_category')
  category: Categories;

  @HasMany(() => Contents, { foreignKey: 'course_id' })
  contents: Contents[];
}
