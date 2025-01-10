import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Tasks } from './project-task.entity';
import { Instructors } from './instructor.entity';
import { ProjectParticipants } from './Project-Participants.entity';
import { Categories } from './category.entity';

@Table
export class Projects extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  project_id: bigint;

  @Column(DataType.STRING)
  project_name: string;

  @Column(DataType.TEXT)
  project_description: string;

  @HasMany(() => Tasks)
  tasks: Tasks[];

  @Column(DataType.TEXT)
  project_img: string;

  @ForeignKey(() => Instructors)
  @Column({ type: DataType.BIGINT })
  project_instructor: bigint;

  @ForeignKey(() => Categories)
  @Column({ type: DataType.BIGINT })
  project_category: bigint;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean;

  @Column(DataType.DATE)
  start_date: Date;

  @Column(DataType.DATE)
  end_date: Date;

  @Column(DataType.JSON)
  required_skills: string[];

  @BelongsTo(() => Categories)
  category: Categories;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_deleted: boolean;

  @HasMany(() => ProjectParticipants, { foreignKey: 'project_id' })
  participants: ProjectParticipants[];

  @BelongsTo(() => Instructors, 'project_instructor')
  instructor: Instructors;
}
