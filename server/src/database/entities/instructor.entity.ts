import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Projects } from './project.entity';
import { Courses } from './course.entity';
import { Links } from './link.entity';
import { Skills } from './skills.entity';

@Table({
  tableName: 'instructors',
  timestamps: true,
  underscored: true,
})
export class Instructors extends Model<Instructors> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: bigint;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    comment: 'Foreign key to Users table',
  })
  instructor_id: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Major field of study or expertise',
  })
  major: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: 'Brief biography of the instructor',
  })
  about_me: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Links to external profiles or resources',
  })
  links: bigint;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: "Link to the instructor's CV",
  })
  user_cv: string;

  @BelongsTo(() => Users, { onDelete: 'CASCADE' })
  user: Users;

  @HasMany(() => Projects, { foreignKey: 'project_instructor' })
  projects: Projects[];

  @HasMany(() => Courses, { foreignKey: 'course_instructor' })
  courses: Courses[];

  @HasMany(() => Links)
  user_link: Links[];

  @HasMany(() => Skills)
  skills: Skills[];
}
