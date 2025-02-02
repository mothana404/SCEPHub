import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Projects } from './project.entity';
import { Students } from './student.entity';

@Table
export class ProjectParticipants extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  participant_id: bigint;

  @ForeignKey(() => Projects)
  @Column({ type: DataType.BIGINT })
  project_id: bigint;

  @ForeignKey(() => Students)
  @Column({ type: DataType.BIGINT })
  student_id: bigint;

  @Column({ type: DataType.BIGINT, defaultValue: 1 })
  accepted: 1 | 2 | 3; // 1 => pending, 2 => accepted, 3 => rejected

  @BelongsTo(() => Projects)
  project: Projects;

  @BelongsTo(() => Students)
  student: Students;
}
