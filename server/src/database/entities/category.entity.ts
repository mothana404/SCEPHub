import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Courses } from './course.entity';
import { Projects } from './project.entity';

@Table
export class Categories extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  category_id: bigint;

  @Column(DataType.STRING)
  category_name: string;

  @HasMany(() => Courses, { foreignKey: 'course_category' })
  courses: Courses[];

  @HasMany(() => Projects, { foreignKey: 'project_category' })
  projects: Projects[];
}
